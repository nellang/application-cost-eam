import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../data.service';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {CostEntry, CostType, PeriodType} from './cost-entry';
import {ApplicationCost} from './application-cost';
import {Application} from '../../entities/application';

declare var firebase: any;

@Component( {
  selector: 'app-application-cost',
  templateUrl: './application-cost.component.html',
  styleUrls: ['./application-cost.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService]
} )

export class ApplicationCostComponent implements OnInit {

  private sub2: any;
  private root: any;

  application: Application = new Application();
  applicationCosts: ApplicationCost[] = [];
  costType = CostType;
  periodType = PeriodType;
  currentDate: string;

  types(): Array<string> {
    return Object.values( this.costType );
  }

  periods(): Array<string> {
    return Object.keys( this.periodType ).map( item => PeriodType[item as string] ).slice( 0, 3 );
  }

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, public http: Http) {
    this.currentDate = Date().toString();
  }

  ngOnInit() {
    this.fbGetData();
  }

  fbGetData() {
    this.sub2 = this.route.params.subscribe( params => {
      this.application.name = params['name'];
    } );

    this.root = firebase.database().ref().child( '/Application/' + this.application.name );

    this.root.on( 'value', (snapshot) => {
      this.application = snapshot.val();
    } );

    this.root.update( {
      ECost: {
        'Setup': {
          AName: 'Setup',
          BDescription: 'Setup cost for SAP ERP',
          CCostEntry: {
            'Tax': {
              AName: 'Tax',
              BAmount: 1500.00,
              CCurrency: 'EUR',
              DType: 'Periodic',
              EPeriod: 'Yearly'
            }
          }
        }
      },
      KEditDate: this.currentDate
    } );

    this.root.child( '/ECost/' ).on( 'value', (snapshot) => {
      snapshot.forEach( (costSnapshot) => {
        const name = costSnapshot.key;
        const cost = costSnapshot.val();
        const costEntries = [];
        this.root.child( '/ECost/' + name ).child( '/CCostEntry/' ).on( 'value', (childSnapshot) => {
          childSnapshot.forEach( (costEntrySnapshot) => {
            const costEntry = costEntrySnapshot.val();
            costEntries.push( createCostEntry( costEntry.AName, costEntry.CCurrency, costEntry.BAmount, costEntry.DType, costEntry.EPeriod ) );
          } );
        } );
        this.applicationCosts.push( createApplicationCost( cost.AName, cost.BDescription, costEntries ) );
      } );
    } );

    console.log( this.applicationCosts.length + ' application costs' );
    this.applicationCosts.forEach( applicationCost => {
      console.log( applicationCost );
    } );

  }

  fbAddCost() {
    const applicationCostTbody = document.getElementsByTagName( 'tbody' );
    for (let i = 1; i <= applicationCostTbody.length; i++) {
      const name = (<HTMLInputElement> document.getElementById( i + 'name' )).value;
      const description = (<HTMLInputElement> document.getElementById( i + 'description' )).value;

      console.log( name, description );

      this.root.on( 'value', (snapshot) => {
        if (!snapshot.hasChild( '/ECost/' )) {
          this.root.child( '/ECost/' ).push();
        }
        if (!snapshot.child( '/ECost/' + name ).hasChild( '/CCostEntry/' )) {
          this.root.child( '/ECost/' + name ).child( '/CCostEntry/' ).push();
        }
      } );

      this.root.child( '/ECost/' + name ).update( {
        AName: name,
        BDescription: description
      } );

      const costEntryTr = applicationCostTbody.item( i - 1 ).getElementsByClassName( 'costEntry' );
      for (let j = 1; j <= costEntryTr.length; j++) {
        let costName;
        if (document.getElementById( i + '' + j + 'costName' ) != null) {
          costName = (<HTMLInputElement> document.getElementById( i + '' + j + 'costName' )).value;
        }
        let currency;
        if (document.getElementById( i + '' + j + 'currency' ) != null) {
          currency = (<HTMLInputElement> document.getElementById( i + '' + j + 'currency' )).value;
        }
        let amount;
        if (document.getElementById( i + '' + j + 'amount' ) != null) {
          amount = (<HTMLInputElement> document.getElementById( i + '' + j + 'amount' )).valueAsNumber;
        }
        let type;
        if (document.getElementById( i + '' + j + 'type' ) != null) {
          type = (<HTMLInputElement> document.getElementById( i + '' + j + 'type' )).value;
        }
        let period;
        if (document.getElementById( i + '' + j + 'period' ) != null) {
          period = (<HTMLInputElement> document.getElementById( i + '' + j + 'period' )).value;
        }

        console.log( costName, amount, currency, type, period );

        this.root.child( '/ECost/' + name ).child( '/CCostEntry/' + costName ).update( {
          AName: costName,
          BAmount: amount,
          CCurrency: currency,
          DType: type,
          EPeriod: period
        } );
      }
    }

    this.root.update( {
      KEditDate: this.currentDate
    } );

    console.log( this.applicationCosts.length + ' application costs' );
    this.applicationCosts.forEach( applicationCost => {
      console.log( applicationCost );
    } );

  }

  addApplicationCost() {

    const costTable = document.getElementById( 'costTable' );
    const lastChildId = String( costTable.children.length + 1 );
    const tbody = document.createElement( 'tbody' );
    tbody.setAttribute( 'id', lastChildId );

    const applicationCostTr = document.createElement( 'tr' );
    const idTd = document.createElement( 'td' );
    const tdText = document.createElement( 'p' );
    tdText.textContent = lastChildId;
    idTd.appendChild( tdText );
    applicationCostTr.appendChild( idTd );

    const nameTd = document.createElement( 'td' );
    const nameInput = document.createElement( 'input' );
    nameInput.setAttribute( 'type', 'text' );
    nameInput.setAttribute( 'class', 'form-control' );
    nameInput.setAttribute( 'ng-model', 'name' );
    nameInput.setAttribute( 'placeholder', 'Enter Name' );
    nameTd.appendChild( nameInput );
    applicationCostTr.appendChild( nameTd );

    const descTd = document.createElement( 'td' );
    const descInput = document.createElement( 'input' );
    descInput.setAttribute( 'type', 'text' );
    descInput.setAttribute( 'class', 'form-control' );
    descInput.setAttribute( 'ng-model', 'desc' );
    descInput.setAttribute( 'placeholder', 'Enter Description' );
    descTd.appendChild( descInput );
    applicationCostTr.appendChild( descTd );
    tbody.appendChild( applicationCostTr );

    const costEntryTr = document.createElement( 'tr' );
    costEntryTr.setAttribute( 'id', lastChildId + 1 );
    const actionTd = document.createElement( 'td' );
    const actionInput = document.createElement( 'button' );
    actionInput.innerText = 'Add Cost Entry';
    actionInput.setAttribute( 'type', 'button' );
    actionInput.onclick = function () {
      const cost = document.getElementById( lastChildId );
      const tr = document.createElement( 'tr' );
      const lastEntryId = String( cost.children.length );
      tr.setAttribute( 'id', lastChildId + lastEntryId );
      tr.appendChild( document.createElement( 'td' ) );
      addTd( tr );
      cost.insertBefore( tr, cost.lastChild );
    };

    actionTd.appendChild( actionInput );
    costEntryTr.appendChild( actionTd );
    addTd( costEntryTr );

    tbody.appendChild( costEntryTr );
    costTable.appendChild( tbody );
  }

  addCostEntry(id): any {
    const cost = document.getElementById( id );
    const tr = document.createElement( 'tr' );
    const lastEntryId = String( cost.children.length );
    tr.setAttribute( 'id', id + lastEntryId );
    tr.appendChild( document.createElement( 'td' ) );
    addTd( tr );
    cost.insertBefore( tr, cost.lastChild );
  }

}

function createCostEntry(name, currency: string, amount: number, type: CostType, period: PeriodType): CostEntry {
  const costEntry: CostEntry = {
    name: name,
    amount: amount,
    currency: currency,
    type: type,
    period: period
  };

  return costEntry;
}

function createApplicationCost(name, description: string, costEntries: CostEntry[]): ApplicationCost {
  const applicationCost: ApplicationCost = {
    name: name,
    description: description,
    costEntries: costEntries
  };

  return applicationCost;
}

function addTd(tr) {
  const nameTd = document.createElement( 'td' );
  const nameInput = document.createElement( 'input' );
  nameInput.setAttribute( 'type', 'text' );
  nameInput.setAttribute( 'class', 'form-control' );
  nameInput.setAttribute( 'ng-model', 'name' );
  nameInput.setAttribute( 'placeholder', 'Enter Name' );
  nameTd.appendChild( nameInput );
  tr.appendChild( nameTd );

  const amountTd = document.createElement( 'td' );
  const amountInput = document.createElement( 'input' );
  amountInput.setAttribute( 'type', 'number' );
  amountInput.setAttribute( 'class', 'form-control' );
  amountInput.setAttribute( 'ng-model', 'name' );
  amountInput.setAttribute( 'placeholder', 'Enter Amount' );
  amountTd.appendChild( amountInput );
  tr.appendChild( amountTd );

  const currencyTd = document.createElement( 'td' );
  const currencyInput = document.createElement( 'input' );
  currencyInput.setAttribute( 'type', 'text' );
  currencyInput.setAttribute( 'class', 'form-control' );
  currencyInput.setAttribute( 'ng-model', 'name' );
  currencyInput.setAttribute( 'placeholder', 'Enter Currency' );
  currencyTd.appendChild( currencyInput );
  tr.appendChild( currencyTd );

  const typeTd = document.createElement( 'td' );
  const label1 = document.createElement( 'label' );
  label1.setAttribute( 'for', 'typeOneOff' );
  label1.textContent = 'One-off';
  const typeInput1 = document.createElement( 'input' );
  typeInput1.setAttribute( 'type', 'radio' );
  typeInput1.setAttribute( 'id', 'typeOneOff' );
  typeInput1.setAttribute( 'class', 'form-control' );
  typeInput1.setAttribute( 'ng-model', 'type' );
  typeInput1.setAttribute( 'value', 'oneOff' );
  const label2 = document.createElement( 'label' );
  label2.setAttribute( 'for', 'typePeriodic' );
  label2.textContent = 'Periodic';
  const typeInput2 = document.createElement( 'input' );
  typeInput2.setAttribute( 'type', 'radio' );
  typeInput2.setAttribute( 'id', 'typePeriodic' );
  typeInput2.setAttribute( 'class', 'form-control' );
  typeInput2.setAttribute( 'ng-model', 'type' );
  typeInput2.setAttribute( 'value', 'periodic' );
  typeTd.appendChild( label1 );
  typeTd.appendChild( typeInput1 );
  typeTd.appendChild( label2 );
  typeTd.appendChild( typeInput2 );
  tr.appendChild( typeTd );

  const periodTd = document.createElement( 'td' );
  const select = document.createElement( 'select' );
  select.setAttribute( 'class', 'form-control' );
  select.setAttribute( 'ng-model', 'period' );
  const option1 = document.createElement( 'option' );
  option1.setAttribute( 'value', 'monthly' );
  option1.textContent = 'Monthly';
  const option2 = document.createElement( 'option' );
  option2.setAttribute( 'value', 'quarterly' );
  option2.textContent = 'Quarterly';
  const option3 = document.createElement( 'option' );
  option3.setAttribute( 'value', 'yearly' );
  option3.textContent = 'Yearly';
  select.appendChild( option1 );
  select.appendChild( option2 );
  select.appendChild( option3 );
  periodTd.appendChild( select );
  tr.appendChild( periodTd );

}
