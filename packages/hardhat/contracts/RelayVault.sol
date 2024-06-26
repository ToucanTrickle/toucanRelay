// //SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import {UserUltraVerifier} from './user_circuit_verifier.sol';
import {RelayUltraVerifier} from './relay_circuit_verifier.sol';

contract RelayVault is Ownable {

    UserUltraVerifier userVerifier;
    RelayUltraVerifier relayVerifier;

    address public wIron;
    uint256 public ironPrice;
    uint8 public ironPriceDecimals;
    uint8 public ironDecimals; // Needs to be same as native asset decimals

    // whitelisted assets supported by the vault
    struct Asset {
        address priceFeed;
        uint8 assetDecimals;
        uint8 priceFeedDecimals;
        uint256 supply;
        bool allowed;
    }


    mapping(address => Asset) public assets;

    mapping(bytes32 => bytes32) private roots;

    event Relay(string indexed memo);

    constructor(address _wIron, UserUltraVerifier _userProofVerifier, RelayUltraVerifier _relayProofVerifier, uint256 _wIronPrice, uint8 _wIronPriceDecimals, uint8 _wIronDecimals)
    Ownable() {
        wIron = _wIron;
        userVerifier = _userProofVerifier;
        relayVerifier = _relayProofVerifier;
        ironPrice = _wIronPrice;
        ironPriceDecimals = _wIronPriceDecimals;
        ironDecimals = _wIronDecimals;
    }

    // Depositors deposit assets to get wIRON
    function deposit(address token, uint256 _amount) public payable {
        assert(assets[token].allowed == true);

        // Transfer token from user to vault
        IERC20(token).transferFrom(msg.sender, address(this), _amount);
        Asset storage asset = assets[token];
        asset.supply += _amount;

        uint256 wIronAmount = _convertPrice(token, _amount);
        
        if(msg.value > 0) {
          Asset storage transferAssetDetails = assets[address(0)];
          transferAssetDetails.supply += msg.value;
          wIronAmount += _convertPrice(address(0), msg.value);
        }

        IERC20(wIron).transfer(msg.sender, wIronAmount);
    }

    // Relay function to relay transactions given proofs of spending limit as input
    function relay(
        bytes calldata userProof,
        bytes32[] calldata userPublicInputs,
        bytes calldata relayProof,
        bytes32[] calldata relayPublicInputs,
        uint256 amountToSpend,
        address transferAsset,
        address payable to,
        string memory memo
    ) external onlyOwner {

        require(userVerifier.verify(userProof, userPublicInputs), "Invalid user proof");

        require(relayVerifier.verify(relayProof, relayPublicInputs), "Invalid relay proof");

        require(transferAsset != address(0));

        Asset memory transferAssetDetails = assets[transferAsset];

        // Only integers amounts are supported in ERC20 asset relay, hence decimals scaled down on both sides 
        require(uint256(relayPublicInputs[33])/(10**9)  == amountToSpend/(10**transferAssetDetails.assetDecimals), "Invalid amount");

        require(IERC20(transferAsset).transfer(to, amountToSpend), "Transfer failed");

        emit Relay(memo);
    }

    // Relay function to relay transactions given proofs of spending limit as input
    function relayEth(
        bytes calldata userProof,
        bytes32[] calldata userPublicInputs,
        bytes calldata relayProof,
        bytes32[] calldata relayPublicInputs,
        uint256 amountToSpend,
        address payable to,
        string memory memo
    ) external onlyOwner {

        require(userVerifier.verify(userProof, userPublicInputs), "Invalid user proof");

        require(relayVerifier.verify(relayProof, relayPublicInputs), "Invalid relay proof");

        // The relay ether's amount is expressed in gwei
        require(uint256(relayPublicInputs[33])*(10**9)  == amountToSpend, "Invalid amount");

        to.transfer(amountToSpend);

        emit Relay(memo);
    }

    function getRootSHA256(bytes32[] calldata relayPublicInputs) external pure returns (bytes32) {
      bytes32[] memory root = relayPublicInputs[1:33];
      return sha256(abi.encodePacked(root));
    }

    function addSupportedAsset(
        address priceFeed,
        uint8 assetDecimals,
        uint8 priceFeedDecimals,
        address tokenAddress) external onlyOwner {

            require(priceFeed != address(0), "!INVALID FEED");

            Asset storage asset = assets[tokenAddress];
            asset.allowed = true;
            asset.priceFeed = priceFeed;
            asset.assetDecimals = assetDecimals;
            asset.priceFeedDecimals = priceFeedDecimals;
            asset.supply = 0;
    }

    function updateIronPrice(uint256 price, uint8 decimals) external onlyOwner {
      ironPrice = price;
      ironPriceDecimals = decimals;
    }

    receive() external payable {
        // This function is executed when a contract receives plain Ether (without data)
        Asset memory transferAssetDetails = assets[address(0)];
        
        require(transferAssetDetails.priceFeed != address(0), "NOT SUPPORTED!");
        
        transferAssetDetails.supply += msg.value;
        uint256 wIronAmount = _convertPrice(address(0), msg.value);
        IERC20(wIron).transfer(msg.sender, wIronAmount);
    }

    function _convertPrice(
        address _fromAsset,
        uint256 _fromAmount
    ) internal view returns(uint256) {
        require(assets[_fromAsset].priceFeed != address(0), "!INVALID(fromAsset)");

        if (_fromAmount == 0) {
            return 0;
        }

        int256 oraclePrice;
        uint256 updatedAt;

        ( , oraclePrice, , updatedAt, ) = AggregatorV3Interface(assets[_fromAsset].priceFeed).latestRoundData();
        uint256 fromOraclePrice = uint256(oraclePrice);
        // require(maxPriceFeedAge == 0 || block.timestamp - updatedAt <= maxPriceFeedAge, "!PRICE_OUTDATED");
        // ( , oraclePrice, , updatedAt, ) = AggregatorV3Interface(assets[_toAsset].priceFeed).latestRoundData();
        uint256 toOraclePrice = uint256(ironPrice);
        // require(maxPriceFeedAge == 0 || block.timestamp - updatedAt <= maxPriceFeedAge, "!PRICE_OUTDATED");

        if (assets[_fromAsset].priceFeedDecimals != ironPriceDecimals) {
            // since oracle precision is different, scale everything
            // to _toAsset precision and do conversion
            return _scalePrice(_fromAmount, assets[_fromAsset].assetDecimals, ironDecimals) *
                    _scalePrice(fromOraclePrice, assets[_fromAsset].priceFeedDecimals, ironDecimals) /
                    _scalePrice(toOraclePrice, ironPriceDecimals, ironDecimals);
        } else {
            // oracles are already in same precision, so just scale _amount to asset precision,
            // and multiply by the price feed ratio
            return _scalePrice(_fromAmount, assets[_fromAsset].assetDecimals, ironDecimals) *
                fromOraclePrice / toOraclePrice;
        }
    }

    function _scalePrice(
        uint256 _price,
        uint8 _priceDecimals,
        uint8 _decimals
    ) internal pure returns (uint256){
        if (_priceDecimals < _decimals) {
            return _price * uint256(10 ** uint256(_decimals - _priceDecimals));
        } else if (_priceDecimals > _decimals) {
            return _price / uint256(10 ** uint256(_priceDecimals - _decimals));
        }
        return _price;
    }
}
