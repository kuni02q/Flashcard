import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Language} from '../../core/models/language';
import {LanguageService} from '../../core/services/language.service';
import {DictionaryGroupService} from '../../core/services/dictionary-group.service';

@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-group-modal.html',
  styleUrl: './create-group-modal.css',
})
export class CreateGroupModal implements OnInit {

  @Output()
  close = new EventEmitter<void>();

  @Output()
  created = new EventEmitter<void>();


  name='';

  description='';

  sourceLanguageId:number | null = null;

  targetLanguageId:number | null = null;

  languages:Language[]=[];

  sourceSearch = '';

  targetSearch = '';

  sourceDropdownOpen = false;

  targetDropdownOpen = false;


  constructor(private languageService:LanguageService, private groupService:DictionaryGroupService){}


  ngOnInit(){
    this.languageService
      .getLanguages()
      .subscribe(data=>{

        this.languages=data;

      });

  }




  create(){

    if(
      !this.name ||
      !this.sourceLanguageId ||
      !this.targetLanguageId
    ){
      return;
    }

    const data={
      name:this.name,
      description:this.description,
      sourceLanguageId:this.sourceLanguageId,
      targetLanguageId:this.targetLanguageId
    };


    this.groupService
      .createGroup(data)
      .subscribe(()=>{

        this.created.emit();

        this.close.emit();
      });

  }



  cancel(){

    this.close.emit();

  }

  get filteredSourceLanguages(){

    return this.languages.filter(
      x =>
        x.name
          .toLowerCase()
          .includes(
            this.sourceSearch.toLowerCase()
          )
    );

  }



  get filteredTargetLanguages(){

    return this.languages.filter(
      x =>
        x.name
          .toLowerCase()
          .includes(
            this.targetSearch.toLowerCase()
          )
    );

  }


  selectSourceLanguage(language:Language){

    this.sourceLanguageId = language.id;
    this.sourceSearch = language.name;

    this.sourceDropdownOpen = false;

  }





  selectTargetLanguage(language:Language){

    this.targetLanguageId = language.id;
    this.targetSearch = language.name;

    this.targetDropdownOpen = false;

  }


  openSourceDropdown(){

    this.sourceDropdownOpen = true;

    this.targetDropdownOpen = false;

  }


  openTargetDropdown(){

    this.targetDropdownOpen = true;

    this.sourceDropdownOpen = false;

  }



  stopPropagation(event:MouseEvent){

    event.stopPropagation();

  }


  @HostListener('document:click')
  closeDropdowns(){

    this.sourceDropdownOpen = false;

    this.targetDropdownOpen = false;

  }

}
