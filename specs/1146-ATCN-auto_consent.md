# Auto consent

- Given I have not set the autoConsent option, when I send a transaction, then I am asked for consent to approve the transaction (<a name="1146-ATCN-001" href="#1146-ATCN-001">1146-ATCN-001</a>)
- Given I have set autoConsent as true and the wallet is unlocked, when I send a transaction that can be approved with autoConsent then I am not asked for consent (<a name="1146-ATCN-002" href="#1146-ATCN-002">1146-ATCN-002</a>)
- Given I have set autoConsent as true and the wallet is unlocked, when I send a transaction that cannot be approved with autoConsent then I am asked for consent (<a name="1146-ATCN-003" href="#1146-ATCN-003">1146-ATCN-003</a>)
- Given I have set autoConsent as true and the wallet is locked, when I send a transaction that can be approved with autoConsent then I am still asked for consent (<a name="1146-ATCN-004" href="#1146-ATCN-004">1146-ATCN-004</a>)
- Given I have set autoConsent to false and the current transaction can be approved with autoConsent then I am prompted on the transaction modal to set this, with an explanation (<a name="1146-ATCN-005" href="#1146-ATCN-005">1146-ATCN-005</a>)
- Given I select the autoConsent prompt on the transaction modal then auto consent is now set to true (<a name="1146-ATCN-006" href="#1146-ATCN-006">1146-ATCN-006</a>)
- Given I have set autoConsent to true, then I am not prompted on the transaction modal to set autoConsent when approving an auto approvable transaction (i.e. if a transaction was sent while wallet was locked) (<a name="1146-ATCN-007" href="#1146-ATCN-007">1146-ATCN-007</a>)
- Given I have set autoConsent to false, and the current transaction cannot be approved with autoConsent then I am not prompted on the transaction modal (<a name="1146-ATCN-008" href="#1146-ATCN-008">1146-ATCN-008</a>)
