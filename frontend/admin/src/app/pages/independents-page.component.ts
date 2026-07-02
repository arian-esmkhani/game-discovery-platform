import { Component, ViewChild } from "@angular/core";
import { IndependentsFormComponent } from "../component/independents-form.component";
import { IndependentsTable } from "../component/independents-tabale.component";
import { SpeedDialCircle } from "../ui/speed-dial.component";

@Component ({
  selector: 'independents-page',
  standalone: true,
  imports: [IndependentsFormComponent, IndependentsTable, SpeedDialCircle ],
  template: `

  @if (activeView === 'table') {
    <independents-table
      (editItem)="onEditItem($event)">
    </independents-table>
  }

  @if (activeView === 'form') {
    <independents-form
      #form
      (editCompleted)="onEditCompleted()"
      (editCancelled)="onEditCancelled()">
    </independents-form>
  }


  <speed-dial-circle (actionSelected)="onActionSelected($event)"></speed-dial-circle>
  `
})

export class IndependentsPage {
  activeView: string = 'table';

  @ViewChild(IndependentsFormComponent) form!: IndependentsFormComponent;
  @ViewChild(IndependentsTable) table!: IndependentsTable;

  onActionSelected(action: string) {
    this.activeView = action;
  }

    onEditItem(event: {category: string, id: number}) {

    this.activeView = 'form';

    setTimeout(() => {
      if (this.form) {
        this.form.loadDataForEdit(event.category, event.id);
      }
    }, 100);
  }

  onEditCompleted() {
    this.activeView = 'table';

    setTimeout(() => {
      if (this.table) {
        this.table.refreshData();
      }
    }, 100);
  }

  onEditCancelled() {
    this.activeView = 'table';
  }
}
