# Browser Wallet

## Create app password

As a browser wallet user I want to create a password for my browser wallet app So that I can secure my wallets and keys on this device

- When I haven't submitted my password, I can go back to the previous step (<a name="1101-ONBD-001" href="#1101-ONBD-001">1101-ONBD-001</a>)
- I can see an explanation of what the password is for and that it cannot be used to recover my keys or recover itself (<a name="1101-ONBD-002" href="#1101-ONBD-002">1101-ONBD-002</a>)
- I can enter a password for the browser wallet (<a name="1101-ONBD-003" href="#1101-ONBD-003">1101-ONBD-003</a>)
- I can verify the password I set for my browser wallet (to help ensure I typed it correctly and can replicate it) (<a name="1101-ONBD-004" href="#1101-ONBD-004">1101-ONBD-004</a>)
- I can verify that I understand that Vega doesn't store and therefore can't recover this password if I lose it (<a name="1101-ONBD-005" href="#1101-ONBD-005">1101-ONBD-005</a>)
- I can NOT submit an empty password (<a name="1101-ONBD-006" href="#1101-ONBD-006">1101-ONBD-006</a>)
- I can submit the password I entered (<a name="1101-ONBD-007" href="#1101-ONBD-007">1101-ONBD-007</a>)
- When I have submitted my new password, I am taken to the next step (<a name="1101-ONBD-008" href="#1101-ONBD-008">1101-ONBD-008</a>)
- When I have submitted my new password, I can NOT go back to the previous step (<a name="1101-ONBD-009" href="#1101-ONBD-009">1101-ONBD-009</a>)
- After setting a password, my wallets are encrypted (<a name="1101-ONBD-010" href="#1101-ONBD-010">1101-ONBD-010</a>)
- I can see the button is disabled and a loading state after submitting (<a name="1101-ONBD-011" href="#1101-ONBD-011">1101-ONBD-011</a>)
- During password creation, there is a way to understand whether the password I have created is secure or not (<a name="1101-ONBD-036" href="#1101-ONBD-036">1101-ONBD-036</a>)

## Create or import wallet

As a browser wallet user I want to decide whether to create a new wallet or import an existing one So that I understand my options and don't waste time creating a new wallet when I already created one elsewhere

- I can choose to create a wallet (<a name="1101-ONBD-012" href="#1101-ONBD-012">1101-ONBD-012</a>)
- I can choose to import an existing wallet (<a name="1101-ONBD-013" href="#1101-ONBD-013">1101-ONBD-013</a>)
- I am given visual feedback that my wallet was successfully created (<a name="1101-ONBD-014" href="#1101-ONBD-014">1101-ONBD-014</a>)
- I am given visual feedback that my wallet was successfully imported (<a name="1101-ONBD-015" href="#1101-ONBD-015">1101-ONBD-015</a>)

## Create wallet and key pair

As a browser wallet user When I am using the browser wallet for the first time I want to create a new wallet (and key pair) So that I can get started using Console / another Vega dapp to trade / take part in governance

- My recovery phrase is rendered in a [hidden container](./1129-HDCN-hidden_container.md) (<a name="1101-ONBD-016" href="#1101-ONBD-016">1101-ONBD-016</a>)
- I can see an explanation of what the recovery phrase is for and that it cannot be recovered itself (<a name="1101-ONBD-017" href="#1101-ONBD-017">1101-ONBD-017</a>)
- I can verify that I understand that Vega doesn't store and therefore can't recover this recovery phrase if I lose it (<a name="1101-ONBD-020" href="#1101-ONBD-020">1101-ONBD-020</a>)
- I am given feedback that my wallet was successfully created (<a name="1101-ONBD-021" href="#1101-ONBD-021">1101-ONBD-021</a>)
- I can see the button is disabled and a loading state after submitting (<a name="1101-ONBD-022" href="#1101-ONBD-022">1101-ONBD-022</a>)
- I am redirected to the next step - opt in to error reporting (<a name="1101-ONBD-023" href="#1101-ONBD-023">1101-ONBD-023</a>)
- The new Wallet name and key pair are auto generated in the background "Wallet" "Vega Key 1" (<a name="1101-ONBD-024" href="#1101-ONBD-024">1101-ONBD-024</a>)
- When I have already created a wallet, I am redirected to the landing page where I can view that wallet (rather than the onboarding flow) (<a name="1101-ONBD-025" href="#1101-ONBD-025">1101-ONBD-025</a>)
- I can go back from secure your wallet to the import/create wallet decision page (<a name="1101-ONBD-037" href="#1101-ONBD-037">1101-ONBD-037</a>)
- If I click back on the secure your wallet page after revealing a recovery phrase, I see a new recovery phrase if I select 'Create Wallet' again (<a name="1101-ONBD-038" href="#1101-ONBD-038">1101-ONBD-038</a>)

## Import existing wallet

As a wallet user When I am using the browser extension for the first time I want to import an existing vega wallet (and key pair(s)) that I created elsewhere i.e. desktop app or CLI So that I can get started using Console / another Vega dapp to trade / take part in governance

- I can see an explanation of what I am being asked to do (<a name="1101-ONBD-026" href="#1101-ONBD-026">1101-ONBD-026</a>)
- I can enter the recovery phrase to import my existing vega wallet (<a name="1101-ONBD-027" href="#1101-ONBD-027">1101-ONBD-027</a>)
- I can submit the recovery phrase I have entered to import the wallet (<a name="1101-ONBD-028" href="#1101-ONBD-028">1101-ONBD-028</a>)
- I can not hit submit until I have entered 12, 15,18, 21 or 24 words (and given feedback that I haven't entered the correct number of words) (<a name="1101-ONBD-029" href="#1101-ONBD-029">1101-ONBD-029</a>)
- If I submit a recovery phrase I am given feedback if the words are invalid i.e. no wallet found with that recovery phrase (and I can try again) (<a name="1101-ONBD-030" href="#1101-ONBD-030">1101-ONBD-030</a>)
- I am redirected to the next step (<a name="1101-ONBD-031" href="#1101-ONBD-031">1101-ONBD-031</a>)
- I can see the button is disabled and a loading state after submitting (<a name="1101-ONBD-032" href="#1101-ONBD-032">1101-ONBD-032</a>)

## Getting started

- I can see a legal disclaimer with a button to read more (<a name="1101-ONBD-033" href="#1101-ONBD-033">1101-ONBD-033</a>)
- I can press read more to see the full disclaimer (<a name="1101-ONBD-034" href="#1101-ONBD-034">1101-ONBD-034</a>)
