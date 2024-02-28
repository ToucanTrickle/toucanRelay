use dep::std;

// wrappers around poseidon hash equivalent to the circom implementation
fn hash_1(input: Field) -> Field {
    std::hash::poseidon::bn254::hash_1([input])
}
fn hash_2(input: [Field; 2]) -> Field {
    std::hash::poseidon::bn254::hash_2(input)
}

fn main(id_nullifier: Field, id_trapdoor: Field, id_commitment: pub Field) {
    // reconstruct the commitment from the private nullfiers
    let secret = hash_2([id_nullifier, id_trapdoor]);
    let id_commitment_reconstructed = hash_1(secret);

    assert(id_commitment_reconstructed == id_commitment);
}

#[test]
fn test_main() {
    let id_nullifier = 1;
    let id_trapdoor = 2;

    let secret = hash_2([id_nullifier, id_trapdoor]);
    let id_commitment_input = hash_1(secret);

    main(id_nullifier, id_trapdoor, id_commitment_input);
}
