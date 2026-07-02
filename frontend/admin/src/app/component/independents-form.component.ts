import { Component, signal, computed, inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

import { CategorySelectorComponent } from '../ui/category-selector.component';
import { FieldFloatLabel } from '../ui/label.component';
import { InputTextarea } from '../ui/input-textarea.component';
import { ImagePickerComponent } from '../ui/image-picker.component';
import { ButtonComponent } from '../ui/button.component';
import { ToastSeverity } from '../ui/toast.component';

import { CharacterHooks } from '../hooks/use-character.hook';
import { CompanyHooks } from '../hooks/use-company.hook';
import { GenreHooks } from '../hooks/use-genre.hook';

import { SaveDto } from '../type/save.type';
import { ApiResponse } from '../type/api-response.type';
import { UpdateResponseDto } from '../type/search-response.type';

@Component({
  selector: 'independents-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CategorySelectorComponent,
    FieldFloatLabel,
    InputTextarea,
    ImagePickerComponent,
    ButtonComponent,
    ToastSeverity
  ],
  providers: [],
  template: `
      <form (ngSubmit)="onSubmit()" class="flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-slate-300">{{ formTitle() }}</h2>
          @if (isEditMode()) {
            <p class="text-slate-400 text-sm mt-1">Editing {{ selectedCategory() }} #{{ editingItemId() }}</p>
          }
        </div>
        <div class="flex flex-row">
          <div class="basis-1/3">

            <app-label
              (nameChange)="name.set($event)">
            </app-label>

            <app-category-selector
              [disabled]="isCategoryDisabled()"
              (categoryChange)="onCategoryChange($event)">
            </app-category-selector>

          </div>
          <div class="basis-2/3 ml-[3vw] mb-5">

            <app-image-picker
              (imageSelected)="imageUrl.set($event)">
            </app-image-picker>

          </div>
        </div>
        <div class="flex flex-col mt-8">

          <app-input-textarea
            (descriptionChange)="description.set($event)">
          </app-input-textarea>

          <div class="flex gap-3 mt-4 ml-[19vw]">
            <!-- Cancel Button in Edit Mode -->
            @if (isEditMode()) {
              <app-button
                type="button"
                variant="secondary"
                size="lg"
                (click)="onCancelEdit()"
                [disabled]="isLoading()"
              >
                Cancel
              </app-button>
            }

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [disabled]="isLoading() || !isFormValid()"
            >
            @if (isLoading()) {
              <span class="pi pi-spin pi-spinner mr-2"></span>
              {{ isEditMode() ? 'Updating...' : 'Saving...' }}
            } @else {
              {{ submitButtonText() }}
            }
            </app-button>
          </div>
        </div>
      </form>
      <toast-severity></toast-severity>
  `
})
export class IndependentsFormComponent {
  private destroy$ = new Subject<void>();

  name = signal<string>('');
  description = signal<string>('');
  imageUrl = signal<string>('');
  selectedCategory = signal<string>('');
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingItemId = signal<number | null>(null);

  @Output() editCancelled = new EventEmitter<void>();
  @Output() editCompleted = new EventEmitter<void>();

  isFormValid = computed(() => {
    return !!(
      this.selectedCategory() &&
      this.name().trim() &&
      this.description().trim() &&
      this.imageUrl()
    );
  });

  formTitle = computed(() =>
    this.isEditMode() ? `Edit ${this.selectedCategory()}` : `Create New ${this.selectedCategory()}`
  );

  submitButtonText = computed(() =>
    this.isEditMode() ? 'Update' : 'Submit'
  );

  isCategoryDisabled = computed(() => this.isEditMode());

  @ViewChild(CategorySelectorComponent) categorySelector!: CategorySelectorComponent;
  @ViewChild(FieldFloatLabel) nameInput!: FieldFloatLabel;
  @ViewChild(InputTextarea) textarea!: InputTextarea;
  @ViewChild(ImagePickerComponent) imagePicker!: ImagePickerComponent;
  @ViewChild(ToastSeverity) toastService!: ToastSeverity;

  private characterHooks = inject(CharacterHooks);
  private companyHooks = inject(CompanyHooks);
  private genreHooks = inject(GenreHooks);


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCategoryChange(category: string): void {
    if (!this.isEditMode()) {
      this.selectedCategory.set(category);
    }
  }

  onCancelEdit(): void {
    const confirmed = confirm('Are you sure you want to cancel editing? All changes will be lost.');
    if (confirmed) {
      this.editCancelled.emit();
      this.resetToCreateMode();
    }
  }

  // Method to load data for editing
  loadDataForEdit(category: string, id: number): void {
    this.isEditMode.set(true);
    this.editingItemId.set(id);
    this.selectedCategory.set(category);

    this.isLoading.set(true);

    const loadOperation = this.getLoadHook()(id);

    loadOperation.subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.data) {
          this.name.set(response.data.name);
          this.description.set(response.data.description);
          this.imageUrl.set(response.data.imageUrl);

          setTimeout(() => {
            if (this.nameInput) {
              this.nameInput.value = response.data!.name;
            }
            if (this.textarea) {
              this.textarea.value = response.data!.description;
            }
            if (this.imagePicker) {
              this.imagePicker.selectedImageUrl = response.data!.imageUrl;
            }
          });
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastService.showError('Failed to load data for editing');
        this.resetToCreateMode();
      }
    });
  }

  onSubmit(): void {
    if (!this.isFormValid() || this.isLoading()) {
      return;
    }

    if (this.isEditMode()) {
      const confirmed = confirm(`Are you sure you want to update this ${this.selectedCategory()}?`);
      if (!confirmed) {
        return;
      }
    }

    this.isLoading.set(true);

    const saveDto: SaveDto = {
      name: this.name().trim(),
      description: this.description().trim(),
      imageUrl: this.imageUrl()
    };

    let operation: Observable<ApiResponse<void>>;

    if (this.isEditMode()) {
      operation = this.getUpdateHook()(this.editingItemId()!, saveDto);
    } else {
      operation = this.getSaveHook()(saveDto);
    }

    operation.subscribe({
      next: (response: ApiResponse<void>) => {
        this.isLoading.set(false);
        if (response.success) {
          const message = this.isEditMode()
            ? `${this.selectedCategory()} updated successfully`
            : `${this.selectedCategory()} saved successfully`;

          this.toastService.showSuccess(message);

          if (this.isEditMode()) {
            setTimeout(() => {
              this.resetToCreateMode();
            }, 1500);
          } else {
            this.resetForm();
          }
        } else {
          this.toastService.showError('Failed to save data!');
        }
      },

      error: (error) => {
        this.isLoading.set(false);
        const message = this.isEditMode()
          ? 'An error occurred while updating'
          : 'An error occurred while saving';
        this.toastService.showError(message);
      }
    });
  }

  private getSaveHook(): (dto: SaveDto) => Observable<ApiResponse<void>> {
    switch (this.selectedCategory()) {
      case 'character':
        return this.characterHooks.useSaveCharacter();
      case 'company':
        return this.companyHooks.useSaveCompany();
      case 'genre':
        return this.genreHooks.useSaveGenre();
      default:
        throw new Error('Invalid category selected');
    }
  }


  private getUpdateHook(): (id: number, dto: SaveDto) => Observable<ApiResponse<void>> {
    switch (this.selectedCategory()) {
      case 'character':
        return this.characterHooks.useUpdateCharacter();
      case 'company':
        return this.companyHooks.useUpdateCompany();
      case 'genre':
        return this.genreHooks.useUpdateGenre();
      default:
        throw new Error('Invalid category selected');
    }
  }

  private getLoadHook(): (id: number) => Observable<ApiResponse<UpdateResponseDto>> {
    switch (this.selectedCategory()) {
      case 'character':
        return this.characterHooks.useGetCharacterById();
      case 'company':
        return this.companyHooks.useGetCompanyById();
      case 'genre':
        return this.genreHooks.useGetGenreById();
      default:
        throw new Error('Invalid category selected');
    }
  }

  private resetToCreateMode(): void {
    this.isEditMode.set(false);
    this.editingItemId.set(null);
    this.resetForm();
  }

  private resetForm(): void {
    this.name.set('');
    this.description.set('');
    this.imageUrl.set('');
    this.selectedCategory.set('');

    this.categorySelector.reset();
    this.nameInput.reset();
    this.textarea.reset();
    this.imagePicker.reset();

    if (this.nameInput) this.nameInput.reset();
    if (this.textarea) this.textarea.reset();
    if (this.imagePicker) this.imagePicker.reset();
    if (this.categorySelector && !this.isEditMode()) {
      this.categorySelector.reset();
    }
  }
}
