export class Capability {
    id: String;
    name: String;
    description: String;
    type:String;
    creationDate:String;
    lastModified:String;
    processes=[];
    applications=[];

    isDomain():boolean{
        return this.type=="Domain";
    }

    isFunctional():boolean{
        return this.type=="Functional";
    }

    isNonFunctional():boolean{
        return this.type=="Non-Functional";
    }

}