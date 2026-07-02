import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="min-w-[20vw] w-[25.4vw]">
      <!-- Preview -->
      @if (selectedImageUrl) {
        <div class="mb-1 ">
          <img
            [src]="selectedImageUrl"
            alt="Preview"
            class="w-full h-48 object-cover rounded-[2rem] border border-gray-300"
          />
          <div class="mt-2 flex flex-nowrap justify-around">
            <app-button
              variant="secondary"
              size="sm"
              (onClick)="removeImage()"
            >
              Remove
            </app-button>
            <app-button
              variant="primary"
              size="sm"
              (onClick)="triggerFileInput()"
            >
              Change
            </app-button>
          </div>
        </div>
      }

      <!-- Upload Button -->
      @if (!selectedImageUrl) {
        <app-button
          variant="primary"
          size="lg"
          (onClick)="triggerFileInput()"
          class="w-full"
        >
          Select Image
        </app-button>
      }

      <!-- Hidden File Input -->
      <input
        #fileInput
        type="file"
        (change)="onFileSelected($event)"
        accept="image/*"
        class="hidden"
      />
    </div>
  `
})
export class ImagePickerComponent {
  @Output() imageSelected = new EventEmitter<string>();

  selectedImageUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl = e.target?.result as string;
        this.imageSelected.emit(this.selectedImageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImageUrl = null;
    this.imageSelected.emit('');
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  reset(): void {
    this.selectedImageUrl = null;
    this.imageSelected.emit('');
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
