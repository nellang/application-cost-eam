import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../data.service';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {CostEntry, CostType, PeriodType} from './cost-entry';
import {Application} from '../../entities/application';

declare var firebase: any;

@Component({
  selector: 'app-application-cost',
  templateUrl: './application-cost.component.html',
  styleUrls: ['./application-cost.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService]
})

export class ApplicationCostComponent implements OnInit {

  private sub2: any;

  name: string;
  description: string;

  application: Application = new Application();

  applicationCosts = [];
  costEntries: CostEntry[] = [];
  currentDate: string;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, public http: Http) {
    this.currentDate = Date().toString();
  }

  ngOnInit() {
    this.fbGetData();
  }

  fbGetData() {
    this.sub2 = this.route.params.subscribe(params => {
      this.application.name = params['name'];
    });

    firebase.database().ref().child('/Application/' + this.application.name).child('ECost').on('child_added', (snapshot) => {
      this.applicationCosts.push(snapshot.val());
    });

    console.log(this.applicationCosts.length);

  }

  fbAddCost(name, descr) {
    console.log(name, descr);
    firebase.database().ref().child('/Application/').child(this.application.name).set({
      AName: this.application.name,
      BDescr: this.application.description,
      CFlag: 'active',
      DCreationDate: this.application.creationDate,
      GDateFrom: this.application.dateFrom,
      HDateTo: this.application.dateTo,
      IGeography: this.application.geography,
      JVersion: this.application.version,
      ECost: {
        AName: name,
        BDescription: descr,
      },
      KEditDate: this.currentDate
    });

    console.log(this.applicationCosts.length);
  }

  addApplicationCost() {
    const costTable = document.getElementById('costTable');

    const lastChildId = String(costTable.children.length + 1);

    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', lastChildId);

    const applicationCostTr = document.createElement('tr');

    const idTd = document.createElement('td');
    const tdText = document.createElement('p');
    tdText.textContent = lastChildId;
    idTd.appendChild(tdText);
    applicationCostTr.appendChild(idTd);

    const nameTd = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('class', 'form-control');
    nameInput.setAttribute('ng-model', 'name');
    nameInput.setAttribute('placeholder', 'Name');
    nameTd.appendChild(nameInput);
    applicationCostTr.appendChild(nameTd);

    const descTd = document.createElement('td');
    const descInput = document.createElement('input');
    descInput.setAttribute('type', 'text');
    descInput.setAttribute('class', 'form-control');
    descInput.setAttribute('ng-model', 'desc');
    descInput.setAttribute('placeholder', 'Description');
    descTd.appendChild(descInput);
    applicationCostTr.appendChild(descTd);

    tbody.appendChild(applicationCostTr);

    const costEntryTr = document.createElement('tr');
    costEntryTr.setAttribute('id', lastChildId + 1);

    const actionTd = document.createElement('td');
    const actionInput = document.createElement('button');
    actionInput.innerText = 'Add Cost Entry';
    actionInput.setAttribute('type', 'button');

    actionInput.onclick = function () {
      const cost = document.getElementById(lastChildId);
      const tr = document.createElement('tr');
      const lastEntryId = String(cost.children.length);
      tr.setAttribute('id', lastChildId + lastEntryId);
      tr.appendChild(document.createElement('td'));

      const costEntryNameTd = document.createElement('td');
      const costEntryNameInput = document.createElement('input');
      costEntryNameInput.setAttribute('type', 'text');
      costEntryNameInput.setAttribute('class', 'form-control');
      costEntryNameInput.setAttribute('ng-model', 'name');
      costEntryNameInput.setAttribute('placeholder', 'Name');
      nameTd.appendChild(costEntryNameInput);
      tr.appendChild(costEntryNameTd);

      const amountTd = document.createElement('td');
      const amountInput = document.createElement('input');
      amountInput.setAttribute('type', 'text');
      amountInput.setAttribute('class', 'form-control');
      amountInput.setAttribute('ng-model', 'name');
      amountInput.setAttribute('placeholder', 'Name');
      amountTd.appendChild(amountInput);
      tr.appendChild(amountTd);

      cost.insertBefore(tr, cost.lastChild);
    };

    actionTd.appendChild(actionInput);
    costEntryTr.appendChild(actionTd);

    const costNameTd = document.createElement('td');
    const costNameInput = document.createElement('input');
    costNameInput.setAttribute('type', 'text');
    costNameInput.setAttribute('class', 'form-control');
    costNameInput.setAttribute('ng-model', 'name');
    costNameInput.setAttribute('placeholder', 'Name');
    nameTd.appendChild(costNameInput);
    costEntryTr.appendChild(costNameTd);

    tbody.appendChild(costEntryTr);

    costTable.appendChild(tbody);
  }

  addCostEntry(id): any {
    const cost = document.getElementById(id);
    const tr = document.createElement('tr');
    const lastEntryId = String(cost.children.length);
    tr.setAttribute('id', id + lastEntryId);
    tr.appendChild(document.createElement('td'));

    const nameTd = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('class', 'form-control');
    nameInput.setAttribute('ng-model', 'name');
    nameInput.setAttribute('placeholder', 'Name');
    nameTd.appendChild(nameInput);
    tr.appendChild(nameTd);

    cost.insertBefore(tr, cost.lastChild);
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
