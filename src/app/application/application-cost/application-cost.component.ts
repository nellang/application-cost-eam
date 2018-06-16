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
    return Object.values( this.periodType ).slice( 0, 3 );
  }

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, public http: Http) {
    this.currentDate = Date().toString();
  }

  ngOnInit() {
    this.fbGetData();
  }

  // get data from database
  fbGetData() {
    this.sub2 = this.route.params.subscribe( params => {
      this.application.name = params['name'];
    } );

    this.root = firebase.database().ref().child( '/Application/' + this.application.name );

    // get application data
    this.root.on( 'value', (snapshot) => {
      this.application = snapshot.val();
      // create cost node in database if not exists
      if (!snapshot.hasChild( '/ECost/' )) {
        this.root.child( '/ECost/' ).push();
      }
    } );

    // add test data
    this.root.update( {
      ECost: {
        'Setup': {
          AName: 'Setup',
          BDescription: 'Setup cost for SAP ERP',
          CCostEntry: {
            'Tax': {
              AName: 'Tax',
              BAmount: 1500.50,
              CCurrency: 'EUR',
              DType: 'Periodic',
              EPeriod: 'Yearly'
            }
          }
        }
      },
      KEditDate: this.currentDate
    } );

    // save data from database into array
    this.root.on( 'value', (snapshot) => {
      if (snapshot.hasChild( '/ECost/' )) {
        this.root.child( '/ECost/' ).on( 'value', (childSnapshot) => {
          childSnapshot.forEach( (costSnapshot) => {
            const name = costSnapshot.key;
            const cost = costSnapshot.val();
            const costEntries = [];
            this.root.child( '/ECost/' + name ).child( '/CCostEntry/' ).on( 'value', (grandChildSnapshot) => {
              grandChildSnapshot.forEach( (costEntrySnapshot) => {
                const costEntry = costEntrySnapshot.val();
                costEntries.push( createCostEntry( costEntry.AName, costEntry.CCurrency, costEntry.BAmount, costEntry.DType, costEntry.EPeriod ) );
              } );
            } );
            this.applicationCosts.push( createApplicationCost( cost.AName, cost.BDescription, costEntries ) );
          } );
        } );
      }
    } );

    console.log( this.applicationCosts.length + ' application costs' );
    this.applicationCosts.forEach( applicationCost => {
      console.log( applicationCost );
    } );

  }

  // add new costs or update
  fbAddCost() {

    // loop through the application costs of an application
    const applicationCostTbody = document.getElementsByTagName( 'tbody' );
    for (let i = 0; i < applicationCostTbody.length; i++) {

      // fetch input data
      const name = (<HTMLInputElement> document.getElementById( i + 'name' )).value;
      const description = (<HTMLInputElement> document.getElementById( i + 'description' )).value;

      console.log( name, description );

      this.root.child( '/ECost/' + name ).update( {
        AName: name,
        BDescription: description,
        CCostEntry: this.applicationCosts[i].costEntries
      } );

      // loop through the cost entries of an application cost
      for (let j = 0; j < applicationCostTbody.item( i ).getElementsByClassName( 'costEntry' ).length; j++) {

        // fetch input data
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
        } else {
          period = PeriodType.none;
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

      console.log( this.applicationCosts[i].name );
      this.root.child( '/ECost/' + this.applicationCosts[i].name ).remove();
    }

    this.root.update( {
      KEditDate: this.currentDate
    } );

    console.log( this.applicationCosts.length + ' application costs' );
    this.applicationCosts.forEach( applicationCost => {
      console.log( applicationCost );
    } );

  }

  // add new HTML Elements for application cost
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

  // add new HTML Elements for cost entry
  addCostEntry(id) {
    const cost = document.getElementById( id );
    const tr = document.createElement( 'tr' );
    const lastEntryId = String( cost.children.length );
    console.log( cost.children );
    tr.setAttribute( 'id', id + lastEntryId );
    tr.appendChild( document.createElement( 'td' ) );
    addTd( tr );
    cost.insertBefore( tr, cost.lastChild );
  }

  // period can't be selected for one-off cost type
  disablePeriod(val) {
    const radioButton = <HTMLInputElement> document.getElementById( val + 'type' );
    if (radioButton.checked && radioButton.value === 'One-off') {
      return true;
    }
    return false;
  }

}

function createCostEntry(name: string, currency: string, amount: number, type: CostType, period: PeriodType): CostEntry {
  const costEntry: CostEntry = {
    name: name,
    amount: amount,
    currency: currency,
    type: type,
    period: period
  };

  return costEntry;
}

function createApplicationCost(name: string, description: string, costEntries: CostEntry[]): ApplicationCost {
  const applicationCost: ApplicationCost = {
    name: name,
    description: description,
    costEntries: costEntries
  };

  return applicationCost;
}

// add HTML input elements
function addTd(tr) {
  const nameTd = document.createElement( 'td' );
  const nameInput = document.createElement( 'input' );
  nameInput.setAttribute( 'type', 'text' );
  nameInput.setAttribute( '[(ng-model)]', 'costEntry.name' );
  nameInput.setAttribute( 'class', 'form-control' );
  nameInput.setAttribute( 'placeholder', 'Enter Name' );
  nameInput.setAttribute( 'id', '{{i}}{{j}}costName' );
  nameTd.appendChild( nameInput );
  tr.appendChild( nameTd );

  const amountTd = document.createElement( 'td' );
  const amountInput = document.createElement( 'input' );
  amountInput.setAttribute( 'type', 'number' );
  nameInput.setAttribute( '[(ng-model)]', 'costEntry.amount' );
  amountInput.setAttribute( 'class', 'form-control' );
  amountInput.setAttribute( 'placeholder', 'Enter Amount' );
  nameInput.setAttribute( 'id', '{{i}}{{j}}amount' );
  amountTd.appendChild( amountInput );
  tr.appendChild( amountTd );

  const currencyTd = document.createElement( 'td' );
  const currencyInput = document.createElement( 'input' );
  currencyInput.setAttribute( 'type', 'text' );
  nameInput.setAttribute( '[(ng-model)]', 'costEntry.currency' );
  currencyInput.setAttribute( 'class', 'form-control' );
  currencyInput.setAttribute( 'placeholder', 'Enter Currency' );
  nameInput.setAttribute( 'id', '{{i}}{{j}}currency' );
  currencyTd.appendChild( currencyInput );
  tr.appendChild( currencyTd );

  const typeTd = document.createElement( 'td' );
  const label1 = document.createElement( 'label' );
  label1.textContent = 'One-off';
  const typeInput1 = document.createElement( 'input' );
  typeInput1.setAttribute( 'type', 'radio' );
  typeInput1.setAttribute( 'id', 'typeOneOff' );
  typeInput1.setAttribute( 'class', 'form-control' );
  typeInput1.setAttribute( 'ng-model', 'costEntry.type' );
  typeInput1.setAttribute( 'value', 'oneOff' );
  const label2 = document.createElement( 'label' );
  label2.textContent = 'Periodic';
  const typeInput2 = document.createElement( 'input' );
  typeInput2.setAttribute( 'type', 'radio' );
  typeInput2.setAttribute( 'id', 'typePeriodic' );
  typeInput2.setAttribute( 'class', 'form-control' );
  typeInput2.setAttribute( 'ng-model', 'costEntry.type' );
  typeInput2.setAttribute( 'value', 'periodic' );
  typeTd.appendChild( label1 );
  typeTd.appendChild( typeInput1 );
  typeTd.appendChild( label2 );
  typeTd.appendChild( typeInput2 );
  tr.appendChild( typeTd );

  const periodTd = document.createElement( 'td' );
  const select = document.createElement( 'select' );
  select.setAttribute( 'class', 'form-control' );
  select.setAttribute( 'ng-model', 'costEntry.period' );
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
