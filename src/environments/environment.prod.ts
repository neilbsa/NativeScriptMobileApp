export class environment{
    public appName :string = 'CivicSystemWeb';
    public domainName : string = `civicmdsg.com.ph`;
    public securityUrl : string = `https://civic.${this.domainName}/${ this.appName }/CivicWebTokenRequest`;
  

    public getCompanyUrl(companyId : string): string{
        return `https://${companyId}.${this.domainName}/${ this.appName }`
    }
}