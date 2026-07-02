import { Component, computed, EventEmitter, inject, Output, signal, ViewChild } from "@angular/core";
import { DatePicker } from "../ui/date-picker.component";
import { ButtonComponent } from "../ui/button.component";
import { CheckboxBasic } from "../ui/checkbox.component";
import { ImagePickerComponent } from "../ui/image-picker.component";
import { InputTextarea } from "../ui/input-textarea.component";
import { FieldFloatLabel } from "../ui/label.component";
import { searchLable } from "../ui/search-labale.component";
import { ToastSeverity } from "../ui/toast.component";
import { SearchRequestDto } from "../type/search-request.type";
import { CharacterHooks } from "../hooks/use-character.hook";
import { CompanyHooks } from "../hooks/use-company.hook";
import { GenreHooks } from "../hooks/use-genre.hook";
import { Observable, Subject, takeUntil } from "rxjs";
import { GameResponseDto, SearchDataDto, SearchResponse } from "../type/search-response.type";
import { AddButton } from "../ui/add-bottun.component";
import { TrashButton } from "../ui/trash-button.component";
import { SaveGameDto } from "../type/save.type";
import { ApiResponse } from "../type/api-response.type";
import { GameHooks } from "../hooks/use-game.hook";

@Component({
  selector: 'game-form',
  standalone: true,
  imports: [
    ImagePickerComponent,
    ButtonComponent,
    InputTextarea,
    FieldFloatLabel,
    CheckboxBasic,
    DatePicker,
    searchLable,
    ToastSeverity,
    AddButton,
    TrashButton
  ],
  template: `

<div class="flex flex-col p-8 bg-gradient-to-br from-gray-900 via-zinc-900 to-gray-900 min-h-screen">

  <!-- Header Section -->
  <div class="flex justify-center mb-8">
    <h1 class="text-2xl md:text-3xl font-bold text-slate-300 tracking-wide">New Game</h1>
  </div>

  <!-- Image Picker Section -->
  <div class="flex justify-center mb-10">
    <app-image-picker
      (imageSelected)="imageUrl.set($event)"
      class="w-full max-w-md">
    </app-image-picker>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">

    <!-- Checkboxes Panel -->
    <div class="xl:col-span-3 bg-zinc-800/40 rounded-2xl border border-rose-900/30 p-6 backdrop-blur-sm">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <label for="trand" class="text-slate-300 font-medium">Is trend?</label>
          <checkbox-basic #trendCheckbox id="trand" (checked)="trandCheckBox.set($event)"></checkbox-basic>
        </div>
        <div class="flex items-center justify-between">
          <label for="nostalgia" class="text-slate-300 font-medium">Is nostalgia?</label>
          <checkbox-basic #nostalgiaCheckbox id="nostalgia" (checked)="nostalgiaCheckBox.set($event)"></checkbox-basic>
        </div>
        <div class="flex items-center justify-between">
          <label for="suggested" class="text-slate-300 font-medium">Is suggested?</label>
          <checkbox-basic #suggestedCheckbox id="suggested" (checked)="suggestedCheckBox.set($event)"></checkbox-basic>
        </div>
      </div>
    </div>

    <!-- Description Textarea -->
    <div class="xl:col-span-6">
      <app-input-textarea
        (descriptionChange)="description.set($event)"
        class="h-full">
      </app-input-textarea>
    </div>

    <!-- Name Input -->
    <div class="xl:col-span-3 ml-[4vw]">
      <app-label
        (nameChange)="name.set($event)"
        class="h-full">
      </app-label>
    </div>
  </div>

  <!-- Bottom Section Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

    <!-- Date Picker -->
    <div class="bg-zinc-800/40 rounded-2xl border border-rose-900/30 p-6 backdrop-blur-sm">
      <label for="date" class="block text-slate-300 font-medium mb-4">Select Date</label>
      <date-picker id="date" (dateSelected)="selectedDate.set($event)"></date-picker>
    </div>

    <!-- Company Selection -->
    <div class="bg-zinc-800/40 rounded-2xl border border-rose-900/30 p-6 backdrop-blur-sm">
      <label for="company" class="block text-slate-300 font-medium mb-4">Company</label>
      <search-lable #companySearch id="company" (searchChange)="onCompanySearchChange($event)"></search-lable>

      <div class="mt-4 space-y-2 max-h-32 overflow-y-auto">
        @if (companySearchResults()) {
          @for (company of companySearchResults()?.searchDataDto?.content; track company.id) {
            <div class="flex items-center justify-between py-2 px-3 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <span class="text-slate-300 text-sm">{{ company.name }}</span>
              <pi-add [tooltip]="'Add item'" (click)="addCompany(company)" class="flex-shrink-0"></pi-add>
            </div>
          }
        }
      </div>

      <div class="mt-4 p-3 bg-rose-900/20 rounded-lg border border-rose-900/30">
        @if (selectedCompany()) {
          <p class="text-slate-300 text-sm">Selected Company: <span class="text-rose-300 font-medium">{{ selectedCompany()?.name }}</span></p>
        } @else {
          <p class="text-slate-400 text-sm">Please select a company</p>
        }
      </div>
    </div>

    <!-- Genre Selection -->
    <div class="bg-zinc-800/40 rounded-2xl border border-rose-900/30 p-6 backdrop-blur-sm">
      <label for="genre" class="block text-slate-300 font-medium mb-4">Genre</label>
      <search-lable #genreSearch id="genre" (searchChange)="onGenreSearchChange($event)"></search-lable>

      <div class="mt-4 space-y-2 max-h-32 overflow-y-auto">
        @if (genreSearchResults()) {
          @for (genre of genreSearchResults()?.searchDataDto?.content; track genre.id) {
            <div class="flex items-center justify-between py-2 px-3 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <span class="text-slate-300 text-sm">{{ genre.name }}</span>
              <pi-add [tooltip]="'Add genre'" (click)="addGenre(genre)" class="flex-shrink-0"></pi-add>
            </div>
          }
        }
      </div>

      <div class="mt-4 p-3 bg-rose-900/20 rounded-lg border border-rose-900/30">
        @if (selectedGenre()) {
          <p class="text-slate-300 text-sm">Selected Genre: <span class="text-rose-300 font-medium">{{ selectedGenre()?.name }}</span></p>
        } @else {
          <p class="text-slate-400 text-sm">Please select a genre</p>
        }
      </div>
    </div>

    <!-- Character Selection -->
    <div class="bg-zinc-800/40 rounded-2xl border border-rose-900/30 p-6 backdrop-blur-sm">
      <label for="character" class="block text-slate-300 font-medium mb-4">Character</label>
      <search-lable #characterSearch id="character" (searchChange)="onCharacterSearchChange($event)"></search-lable>

      <div class="mt-4 space-y-2 max-h-32 overflow-y-auto mb-4">
        @if (characterSearchResults()) {
          @for (character of characterSearchResults()?.searchDataDto?.content; track character.id) {
            <div class="flex items-center justify-between py-2 px-3 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <span class="text-slate-300 text-sm">{{ character.name }}</span>
              <pi-add [tooltip]="'Add item'" (click)="addCharacter(character)" class="flex-shrink-0"></pi-add>
            </div>
          }
        }
      </div>

      <!-- Selected Characters Table -->
      <div class="border border-rose-900/30 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-rose-900/20">
            <tr>
              <th class="py-3 px-4 text-left text-slate-300 font-medium text-sm">Name</th>
              <th class="py-3 px-4 text-right text-slate-300 font-medium text-sm">Action</th>
            </tr>
          </thead>
          <tbody class="bg-zinc-800/30">
            @if (selectedCharacters().length === 0) {
              <tr>
                <td colspan="2" class="py-8 text-center text-slate-400 text-sm">
                  No Character is selected
                </td>
              </tr>
            } @else {
              @for (character of selectedCharacters(); track character.id) {
                <tr class="border-t border-rose-900/20 hover:bg-zinc-700/30 transition-colors">
                  <td class="py-3 px-4 text-slate-300 text-sm">{{ character.name }}</td>
                  <td class="py-3 px-4 text-right">
                    <pi-trash
                      [tooltip]="'Delete item'"
                      (click)="removeCharacter(character.id)"
                      class="inline-flex">
                    </pi-trash>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Submit Button -->
  <div class="flex justify-center mt-8">
    <app-button
      type="submit"
      variant="primary"
      size="lg"
      class="shadow-lg shadow-rose-900/30 hover:shadow-rose-900/40 transition-all duration-300 transform hover:scale-105"
      (onClick)="onSubmit()"
      [disabled]="loading()">

      @if (loading()) {
        <span class="pi pi-spin pi-spinner mr-2"></span>
        Loading...
      } @else {
        Submit
      }
    </app-button>
  </div>

  <toast-severity></toast-severity>
</div>

  `
})

export class GameForm {
  private destroy$ = new Subject<void>();
  private companySearchTimeout: any;
  private genreSearchTimeout: any;
  private characterSearchTimeout: any;
  private currentPage : number = 0;

  imageUrl = signal<string>('');
  trandCheckBox = signal<boolean>(false);
  nostalgiaCheckBox = signal<boolean>(false);
  suggestedCheckBox = signal<boolean>(false);
  description = signal<string>('');
  name = signal<string>('');
  selectedDate = signal<Date | null>(null);
  companySearchQuery = signal<string>('');
  genreSearchQuery = signal<string>('');
  characterSearchQuery = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  companySearchResults = signal<SearchResponse | null>(null);
  genreSearchResults = signal<SearchResponse | null>(null);
  characterSearchResults = signal<SearchResponse | null>(null);
  selectedCompany = signal<SearchDataDto | null>(null);
  selectedGenre = signal<SearchDataDto | null>(null);
  selectedCharacters = signal<SearchDataDto[]>([]);
  isEditMode = signal<boolean>(false);
  editingItemId = signal<number | null>(null);

  @ViewChild(ToastSeverity) toastService!: ToastSeverity;
  @ViewChild(searchLable) searchLabel!: searchLable;
  @ViewChild(FieldFloatLabel) nameInput!: FieldFloatLabel;
  @ViewChild(InputTextarea) textarea!: InputTextarea;
  @ViewChild(ImagePickerComponent) imagePicker!: ImagePickerComponent;
  @ViewChild(CheckboxBasic) checkboxBasic!: CheckboxBasic;
  @ViewChild(DatePicker) datePicker!: DatePicker;
  @ViewChild('companySearch') companySearchLabel!: searchLable;
  @ViewChild('genreSearch') genreSearchLabel!: searchLable;
  @ViewChild('characterSearch') characterSearchLabel!: searchLable;
  @ViewChild('trendCheckbox') trendCheckbox!: CheckboxBasic;
  @ViewChild('nostalgiaCheckbox') nostalgiaCheckbox!: CheckboxBasic;
  @ViewChild('suggestedCheckbox') suggestedCheckbox!: CheckboxBasic;

  @Output() editCancelled = new EventEmitter<void>();
  @Output() editCompleted = new EventEmitter<void>();

  private characterHooks = inject(CharacterHooks);
  private companyHooks = inject(CompanyHooks);
  private genreHooks = inject(GenreHooks);
  private gameHooks = inject(GameHooks);

  formTitle = computed(() =>
    this.isEditMode() ? `Edit Game` : `Create New Game`
  );

  submitButtonText = computed(() =>
    this.isEditMode() ? 'Update' : 'Submit'
  );

  onCancelEdit(): void {
    const confirmed = confirm('Are you sure you want to cancel editing? All changes will be lost.');
    if (confirmed) {
      this.editCancelled.emit();
      this.resetToCreateMode();
    }
  }

    // Method to load data for editing
  loadDataForEdit(id: number): void {
    this.isEditMode.set(true);
    this.editingItemId.set(id);

    this.loading.set(true);

    const loadOperation = this.gameHooks.useGetGameById()(id);

    loadOperation.subscribe({
      next: (response: ApiResponse<GameResponseDto>) => {

        this.loading.set(false);
        if (response.data) {
          const game = response.data;

          this.name.set(game.name);
          this.description.set(game.description);
          this.imageUrl.set(game.imageUrl);
          this.nostalgiaCheckBox.set(game.isNostalgia);
          this.trandCheckBox.set(game.isTrend);
          this.suggestedCheckBox.set(game.isSuggested);
          if (game.producedIn) {
            const producedInDate = new Date(game.producedIn);
            this.selectedDate.set(producedInDate);
          } else {
            this.selectedDate.set(null);
          }
          this.selectedCharacters.set(game.characters);
          this.selectedCompany.set(game.company);
          this.selectedGenre.set(game.genre);

          setTimeout(() => {
            if (this.nameInput) {
              this.nameInput.value = game.name;
            }
            if (this.textarea) {
              this.textarea.value = game.description;
            }
            if (this.imagePicker) {
              this.imagePicker.selectedImageUrl = game.imageUrl;
            }
            if (this.datePicker && game.producedIn) {
              const producedInDate = new Date(game.producedIn);
              this.datePicker.setValue(producedInDate);
            }
            if (this.trendCheckbox) {
              this.trendCheckbox.setValue(game.isTrend);
            }
            if (this.nostalgiaCheckbox) {
              this.nostalgiaCheckbox.setValue(game.isNostalgia);
            }
            if (this.suggestedCheckbox) {
              this.suggestedCheckbox.setValue(game.isSuggested);
            }

          });
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.showError('Failed to load data for editing');
        this.resetToCreateMode();
      }
    });
  }



  addCharacter(character: SearchDataDto) {
    const current = this.selectedCharacters();

    if (!current.find(c => c.id === character.id)) {
      this.selectedCharacters.set([...current, character]);
      this.characterSearchLabel.reset();
      this.characterHooks.clearSearchResults();
      this.characterSearchResults.set(null);
      this.characterSearchQuery.set('');
    } else {
      this.toastService.showInfo('Already selected')
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.companySearchTimeout);
    clearTimeout(this.characterSearchTimeout);
    clearTimeout(this.genreSearchTimeout);
  }

  addCompany(company: SearchDataDto) {
    this.selectedCompany.set(company);
    this.companySearchLabel.reset();
    this.companyHooks.clearSearchResults();
    this.companySearchResults.set(null);
    this.companySearchQuery.set('');
  }

  addGenre(genre: SearchDataDto) {
    this.selectedGenre.set(genre);
    this.genreSearchLabel.reset();
    this.genreHooks.clearSearchResults();
    this.genreSearchResults.set(null);
    this.genreSearchQuery.set('');
  }

  removeCharacter(characterId: number) {
    const current = this.selectedCharacters();
    this.selectedCharacters.set(current.filter(c => c.id !== characterId));
  }


  isFormValid = computed(() => {
    return !!(
      this.name().trim() &&
      this.description().trim() &&
      this.imageUrl() &&
      this.selectedDate() &&
      this.selectedCharacters().length > 0 &&
      this.selectedCompany() &&
      this.selectedGenre()
    );
  });

  onCompanySearchChange(query: string) {
    this.companySearchQuery.set(query);

    // Debounce search - perform search after 300ms of no typing
    clearTimeout(this.companySearchTimeout);
    this.companySearchTimeout = setTimeout(() => {
      this.companyPerformSearch();
    }, 300);
  }

  onGenreSearchChange(query: string) {
    this.genreSearchQuery.set(query);

    // Debounce search - perform search after 300ms of no typing
    clearTimeout(this.genreSearchTimeout);
    this.genreSearchTimeout = setTimeout(() => {
      this.genrePerformSearch();
    }, 300);
  }

  onCharacterSearchChange(query: string) {
    this.characterSearchQuery.set(query);

    // Debounce search - perform search after 300ms of no typing
    clearTimeout(this.characterSearchTimeout);
    this.characterSearchTimeout = setTimeout(() => {
      this.characterPerformSearch();
    }, 300);
  }

  companyPerformSearch() {
    if (!this.companySearchQuery().trim()){
      this.companyHooks.clearSearchResults();
      this.companySearchResults.set(null);
      return;
    }

    const searchRequest: SearchRequestDto = {
        page: this.currentPage,
        name: this.companySearchQuery().trim() || " "
    };

    this.loading.set(true);
    this.error.set(null);

    let searchObservable = this.companyHooks.useSearchCompany()(searchRequest);

    searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.companySearchResults.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Search failed');
        this.loading.set(false);
        this.showErrorToast(error);
      }
   });
  }

  genrePerformSearch() {
    if (!this.genreSearchQuery().trim()){
      this.genreHooks.clearSearchResults();
      this.genreSearchResults.set(null);
      return;
    }

    const searchRequest: SearchRequestDto = {
        page: this.currentPage,
        name: this.genreSearchQuery().trim() || " "
    };

    this.loading.set(true);
    this.error.set(null);

    let searchObservable = this.genreHooks.useSearchGenre()(searchRequest);

    searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.genreSearchResults.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Search failed');
        this.loading.set(false);
        this.showErrorToast(error);
      }
   });
  }

  characterPerformSearch() {
    if (!this.characterSearchQuery().trim()){
      this.characterHooks.clearSearchResults();
      this.characterSearchResults.set(null);
      return;
    }

    const searchRequest: SearchRequestDto = {
        page: this.currentPage,
        name: this.characterSearchQuery().trim() || " "
    };

    this.loading.set(true);
    this.error.set(null);

    let searchObservable = this.characterHooks.useSearchCharacters()(searchRequest);

    searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.characterSearchResults.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Search failed');
        this.loading.set(false);
        this.showErrorToast(error);
      }
   });
  }

  onSubmit() {
    if (!this.isFormValid() || this.loading()) {
      this.toastService.showWarn("Pleas fill all entries");
      return;
    }

    if (this.isEditMode()) {
      const confirmed = confirm(`Are you sure you want to update this ?`);
      if (!confirmed) {
        return;
      }
    }

    this.loading.set(true);

    const saveGame : SaveGameDto = {
      name : this.name().trim(),
      description : this.description().trim(),
      imageUrl : this.imageUrl(),
      isNostalgia : this.nostalgiaCheckBox(),
      isSuggested : this.suggestedCheckBox(),
      isTrend : this.trandCheckBox(),
      ProducedIn: this.selectedDate()!.toISOString().split("T")[0],
      genreId : this.selectedGenre()!.id,
      companyId : this.selectedCompany()!.id,
      characterIds : this.selectedCharacters().map(c => c.id)
    }

    let operation: Observable<ApiResponse<void>>;

    if (this.isEditMode()) {
      operation = this.gameHooks.useUpdateGame()(this.editingItemId()!, saveGame);
    } else {
      operation = this.gameHooks.useSaveGame()(saveGame);
    }

    operation.subscribe({
      next: (response: ApiResponse<void>) => {
        this.loading.set(false);
        if (response.success) {

          const message = this.isEditMode()
            ? `updated successfully`
            : `saved successfully`;

          this.toastService.showSuccess(message);
          this.resetForm()

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
        this.loading.set(false);
        this.toastService.showError('An error occurred');
      }
    });
  }

  private resetForm(): void {
    if (this.trendCheckbox) this.trendCheckbox.reset();
    if (this.nostalgiaCheckbox) this.nostalgiaCheckbox.reset();
    if (this.suggestedCheckbox) this.suggestedCheckbox.reset();
    if (this.nameInput) this.nameInput.reset();
    if (this.textarea) this.textarea.reset();
    if (this.imagePicker) this.imagePicker.reset();
    if (this.datePicker) this.datePicker.reset();

    this.name.set('');
    this.description.set('');
    this.imageUrl.set('');
    this.trandCheckBox.set(false);
    this.nostalgiaCheckBox.set(false);
    this.suggestedCheckBox.set(false);
    this.selectedDate.set(null);
    this.companySearchQuery.set('');
    this.genreSearchQuery.set('');
    this.characterSearchQuery.set('');
    this.selectedCompany.set(null);
    this.selectedGenre.set(null);
    this.selectedCharacters.set([]);
    this.companySearchResults.set(null);
    this.genreSearchResults.set(null);
    this.characterSearchResults.set(null);

    this.companyHooks.clearSearchResults();
    this.genreHooks.clearSearchResults();
    this.characterHooks.clearSearchResults();
  }

  private resetToCreateMode(): void {
    this.isEditMode.set(false);
    this.editingItemId.set(null);
    this.resetForm();
  }

  ngAfterViewInit() {
  }

  private showErrorToast(message: string | null): void {
    setTimeout(() => {
      if (this.toastService) {
        this.toastService.showError(message || 'An error occurred');
      }
    }, 100);
  }
}
