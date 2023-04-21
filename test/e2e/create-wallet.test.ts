import { Builder, Capabilities, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { CreateWallet } from "./wallet-helpers/wallet-creation";

describe("Create wallet", () => {
  let driver: WebDriver;
  let createWallet: CreateWallet;
  const extensionPath = "./build";
  const testPassword = "password1";

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments(`--load-extension=${extensionPath}`);
    driver = await new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(options).build();
    createWallet = new CreateWallet(driver);
  });

  beforeEach(async () => {
    await createWallet.navigateToLandingPage();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it("can create a new wallet", async () => {
    await createWallet.configureNewWalletWithPasswords(testPassword);
    await createWallet.secureNewWallet();
    expect(await createWallet.isWalletCreated(), "Expected to be on the create wallet success screen but was not").toBe(
      true
    );
  });

  it("shows an error message when passwords differ", async () => {
    await createWallet.configureNewWalletWithPasswords(testPassword, testPassword + "2");
    expect(await createWallet.getErrorMessageText()).toBe("Please enter identical passwords in both fields");
    expect(
      await createWallet.isPasswordPage(),
      "expected to remain on the password page after failing password validation"
    ).toBe(true);
  });

  it("check error shown and cannot proceed without acknowledging password warning", async () => {
    await createWallet.configureNewWalletWithPasswords(testPassword, testPassword, false);
    expect(await createWallet.getErrorMessageText()).toBe("Please acknowledge the password warning to continue");
    expect(
      await createWallet.isPasswordPage(),
      "expected to remain on the password page after not acknowledging the password warning"
    ).toBe(true);
  });

  it("check cannot proceed without revealing the revovery phrase", async () => {
    await createWallet.configureNewWalletWithPasswords(testPassword);
    expect(
      await createWallet.canAttemptContinueFromSecureWallet(),
      "expected to be unable to proceed without revealing the recovery phrase"
    ).toBe(false);
  });

  it("shows an error message when recovery phrase warning not acknowledged", async () => {
    await createWallet.configureNewWalletWithPasswords(testPassword);
    await createWallet.secureNewWallet(false);
    expect(await createWallet.getErrorMessageText()).toBe("Please acknowledge the recovery phrase warning to continue");
    expect(
      await createWallet.isSecureWalletPage(),
      "expected to remain on the secure wallet page after not acknowledging the recovery phrase warning"
    ).toBe(true);
  });
});
