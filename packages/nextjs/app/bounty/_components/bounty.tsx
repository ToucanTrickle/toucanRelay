export const BountyPage = () => {
  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="container mx-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">ToucanRelay Bounty Program</h2>
        <div className="px-6 lg:px-10 w-full">
          <div className=" bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Bug bounty scope</p>
              <p className="font-small my-0 break-words">
                The scope for the current bounty program are the toucanrelay ZK circuits in
                https://github.com/ToucanTrickle/toucanRelay/tree/main/packages/circuits
              </p>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Bounty rewards</p>
              <p className="font-small my-0 break-words">Low Severity: $50</p>
              <p className="font-small my-0 break-words">Medium Severity: $100</p>
              <p className="font-small my-0 break-words">High Severity: $500</p>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Bug Reporting</p>
              <p className="font-small my-0 break-words">
                Please encrypt the message with the PGP public key below and mail to prajjawal@toucantrickle.com
              </p>
              <p className="font-small my-0 break-words">
                -----BEGIN PGP PUBLIC KEY BLOCK----- xsFNBGamaF4BEAC+/uqekDTBih2cC9aVAXRwJ4e6Gv7k1GDAtQtQi23bCRGp
                ymUoIn7N7ABqfcAHk2IGkukjlA9up4pGmV2Kz3VJpp+Hh/dgtW/ii0o4SDHm
                5WH8BiCVJKTM180cAQfN+A5P3v7DBKPzgHSM560uZw6+mMIS0rmQywYs1tu5
                w91/9NNYNdQSvYUjWpW2HJOJrPThU2cIiUK1dkfaHI1nS9VqrSxmhJ8i5My1
                5HGETKf5SQccE2WUDf70d/cIg3OZYlfCJARe5v5H8WN7WV2EBPsjMoP0Hof4
                1UBmTHkUeCCVg6Xxz7qjyqmM6pW5H7mCuk68PzH6FD3UyFY7vpCkA3YaRd5q
                65Vt6jnrdJqIqg3+aXyS47Nsqn6PizGaN+4/Bw9Zz8BlGW7to0GNM3RbaaYU
                MXs42IweEiW6bjCSUFoQBLxjkpi6dZUqfwLr0tKloh8nW3iwWKYLxyyJGYI5
                XmXXva+gUVw9XKOnJBqeNc87hYvXtixEQ/RsYcwX6mi50Wt32n3gKccmsoTz
                TX5/awAIn6g5TU5xDawEDSxZSjoGhFAeL6lu/rIsr2ZY+IRe+weMnM2e4xL9
                L9RDPwqeizXF6OxJJobRMHF/VElhb+3ZtYAeNqFprLkiprbNBg8rMY7IxNVu
                80kYX8ZogsEUSZag0+Vsd9SNXX6ote1uHaepqwARAQABzSdQcmFqamF3YWwg
                PHByYWpqYXdhbEB0b3VjYW50cmlja2xlLmNvbT7CwYoEEAEIAD4FgmamaF4E
                CwkHCAmQKpYd8Aa9TqkDFQgKBBYAAgECGQECmwMCHgEWIQSail1ysh+64+u6
                V/4qlh3wBr1OqQAAmk8P/jRL/FV0ZwPEAvX/XE+OKVhuSmItmtZ0FEtWbRu/
                uEucvJva/MCOPFHtKbOY72sNYEEgc7yRc+21NVDwONt2pPhP5Mm8WqvrsSnw
                kEOYN1o77ueOAaMv7ciz8N0M07uF35aqUB6HR0vY0RrHC1yEq5drwUoTEhAe
                TUqLMktxtcUGL/r90g7zcZoj4LfT18JGE6Hq0v7McjJ+mgSCXgTNjZOZp2s0
                bmWgS2br/bOPrG3AsYb+0eCN1yITY/kdxKP4B4ZmWrHa9r7n8vWjGV+jmVMT
                Mp5dyoxPv7jzeRjjpyGTbRsd8qOvZg2zZwmWgIsXFjCnvFiDGZADfGWkxAsf
                m5I+lBIiuvS2V45ifMuoOTeNxMGmVcwV8gdMcUUIUK0aaVxbKOOF7o1pL7OK
                MUrOQ0Hoj4G8PCsbISKl8gegRLSdrks9m4Inuz6Ajq5QC+wbs1+Q0YNstuMf
                Z1voeFUQW9atspPx3r65NDMlNAdrB9w0tObdWCGvgi1ADBQSSqqzHOGrYToH
                9OzhnX+FjZIGPVra4qWM6UocsHcPieBbtMP680kz62V4hbRNtbLTvOTMWSnV
                cJSFE7aHM9NpDntJhn8RBlFlaUoS+JiBt2Nm27ZHbxCKktAeOlBNXU1U5M4r
                Kye3Q0v+4ZBXypVhNVso0ozALDCMXlfeKlwNR/0fzJNmzsFNBGamaF4BEACq
                Etxwl+GW/CvHjV88XPNe5KxHkdxaoJ0qK3zemeU2m/o5qVkm/0kPE4hUoaXo
                9OBFYPAX0pBI4IbPT/X2Cc9chH5uaczx1izqVyTB5V+kWm4i2cKeaSiyLj6K
                kPkUs1U634D5DlIyR7+hlAUHs0uY2IpDE2Qbur3LfRpooSz4E6oH1NCr+kfr
                4y7cVt9nXYoJUQmbun5S9fiSSIZXzZr/9lAcJYbPES4NFq5fVECzydI5nvEo
                8TIw8O8wkBMcdrZtmg5Be37IoVMvOd/7ZPoC2jlnX+vgtO51CnmtJMeDxAoi
                fxJldDHol0GnwRSgZzqaTH19b3hFYCQnCllQmrJ/Ft+dzxx3u+rR1R1h7h+z
                oeKVg1zVSPKjdUxiAOv6u0jjmgyine8+p/Ag5NzY1raL9FtlfScYpRDtN5pf
                QXOtDKja0oh+N0of4ub6+0znfiZbhqs8uoMq4Z+d/MS7Tz0RXaUPKjIgNWee
                P9cuQPCTrdTVCwO6X29N+HrheDrar1GafKcEzYVJkDXpYsCwQaQI1k048/GT
                85yzLmT3PrMoFuZVJs+tD49wlSPySYso93KGXQ+Ms8wAoV++8mnH+POGliz8
                Mr4lp+RUw7yVZwBL4eq0hIYRAlS9fj4KoFXzHA0RxpRJktnRHAdKws0cwDQi
                8a4T/C08j06+xr4eqAvkiQARAQABwsF2BBgBCAAqBYJmpmheCZAqlh3wBr1O
                qQKbDBYhBJqKXXKyH7rj67pX/iqWHfAGvU6pAAAdPw//Wq1SVD3UxED51flx
                W++KAPmgqUOyKUkzBYAchYxj6cudbYf658E7xTg1ukIfYRC71fr3jqwdClpI
                EDSud7v1zB4yDfrprceFWDqk/Le+ud2wgoGTwUmXIDcbwtRXlrMSoIdPp2lA
                XDcb6QdTdNZIxRA3lGuVODXG+NADII1aTJ9I25m4dPREc+33XlA1lumFK6xJ
                330985GBITM79TonGofWbOTtA5mZhOPqF3bPkKSPS2201bjdbsQCUQCqhNPr
                JKrqHfKHeAUCHRmFzPjl0Qfc6bPvcT2uKsZh/Qoae61Ey+q98WlEkmAjKq67
                Us7Wepc62Wjzorai4sW0An8QRVzBm4s218vzptTfcclYZTaxnaYrNoph3SLe
                JuIHPsbwqvpn9CY5oFUgxklDu4GeOa/GKIZ+79MnWuHRsp4grINKo6IU/v2d
                xOKC19itwt38xzVQNWeyYY8te4sJhIgKK+6JM7mRVxl6stmbs6PW4r2FMVe+
                eEHnoolNYgnbw9JKJPxByUnSqomtv+0KJ18ksQNSOfyfsCxpCtahEaBZw8fw
                deGak6kphLAYTJG3Fw6+Fc3tBPCZ3Lk4JLMYJsGIJl9hz0PN+qZXv5o4FG/Q
                XB5QVswHQ1kU1VGJQ1o2iFPmmR2UA0XNO7acOFWkBq6gyhhuj75N2tMx+tMV OpI50WU= =DqRk -----END PGP PUBLIC KEY
                BLOCK-----
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
