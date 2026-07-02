import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
@Component({
    selector: 'toast-severity',
    standalone: true,
    imports: [Toast],
    providers: [MessageService],
    template: `
      <p-toast position="bottom-right"/>
    `
})
export class ToastSeverity {
  constructor(private messageService: MessageService) {}

  showSuccess(detail: string = 'Operation completed successfully') {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  showError(detail: string = 'An error occurred') {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  showInfo(detail: string = 'Information') {
    this.messageService.add({ severity: 'info', summary: 'Info', detail });
  }

  showWarn(detail: string = 'Warning') {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail });
  }
}
