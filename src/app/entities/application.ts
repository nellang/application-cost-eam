export class Application {
    id: String;
    name: String = '';
    description: String = '';
    creationDate:String = '';
    lastModified:String = '';
    geography: String = '';
    version: String = '';
    dateFrom: String = '';
    dateTo: String = '';
    type: String = '';

    isAsIs():boolean{
        return this.dateFrom <= Date() && Date() <= this.dateTo;
    }

    isToBe():boolean{
        return this.dateFrom > Date();
    }

    isSunset():boolean{
        return this.dateTo < Date();
    }

}