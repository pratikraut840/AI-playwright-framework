declare module 'multiple-cucumber-html-reporter' {
  interface Browser {
    name: string;
    version: string;
  }

  interface Platform {
    name: string;
    version: string;
  }

  interface Metadata {
    browser?: Browser;
    device?: string;
    platform?: Platform;
  }

  interface CustomDataEntry {
    label: string;
    value: string;
  }

  interface CustomData {
    title: string;
    data: CustomDataEntry[];
  }

  interface ReportOptions {
    /** Directory containing the Cucumber JSON output files */
    jsonDir: string;
    /** Directory where the HTML report will be written */
    reportPath: string;
    metadata?: Metadata;
    customData?: CustomData;
    /** Use custom metadata columns instead of the default ones */
    customMetadata?: boolean;
    plainDescription?: boolean;
    /** Override the default stylesheet filename */
    overrideStyle?: string;
    /** Path to custom CSS file to add additional styles */
    customStyle?: string;
    pageTitle?: string;
    reportName?: string;
    pageFooter?: string;
    displayDuration?: boolean;
    durationInMS?: boolean;
    hideMetadata?: boolean;
    displayReportTime?: boolean;
    openReportInBrowser?: boolean;
    saveCollectedJSON?: boolean;
    disableLog?: boolean;
  }

  function generate(options: ReportOptions): void;
}
