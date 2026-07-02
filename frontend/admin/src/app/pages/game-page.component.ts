import { Component, ViewChild } from "@angular/core";
import { SpeedDialCircle } from "../ui/speed-dial.component";
import { GameForm } from "../component/game-form.component";
import { GameTable } from "../component/game-table.component";

@Component ({
  selector: 'game-page',
  standalone: true,
  imports: [GameForm, GameTable, SpeedDialCircle ],
  template: `

  @if (activeView === 'table') {
    <game-table
      (editItem)="onEditItem($event)">
    </game-table>
  }

  @if (activeView === 'form') {
    <game-form
      #form
      (editCompleted)="onEditCompleted()"
      (editCancelled)="onEditCancelled()">
    </game-form>
  }


  <speed-dial-circle (actionSelected)="onActionSelected($event)"></speed-dial-circle>
  `
})

export class GamePage {
  activeView: string = 'table';

  @ViewChild(GameForm) form!: GameForm;
  @ViewChild(GameTable) table!: GameTable;

  onActionSelected(action: string) {
    this.activeView = action;
  }

    onEditItem(event: {id: number}) {

    this.activeView = 'form';

    setTimeout(() => {
      if (this.form) {
        this.form.loadDataForEdit(event.id);
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
