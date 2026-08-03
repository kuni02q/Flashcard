import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GroupCard} from '../../components/group-card/group-card';
import {DictionaryGroupCard} from '../../core/models/dictionary-group-card';
import {DictionaryGroupService} from '../../core/services/dictionary-group.service';
import {CreateGroupModal} from '../../components/create-group-modal/create-group-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GroupCard, CreateGroupModal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  groups:DictionaryGroupCard[] = [];

  showCreateModal=false;

  constructor(private groupService:DictionaryGroupService, private cdr:ChangeDetectorRef) {}


  ngOnInit(){

    this.loadGroups();

  }



  loadGroups(){

    this.groupService.getMyGroups()
      .subscribe({

        next:data=>{
          this.groups=data;

          this.cdr.markForCheck();
        },


        error:error=>{
          console.log(error);
        }


      });


  }


  groupCreated(){

    this.showCreateModal=false;

    this.loadGroups();


  }


  deleteGroup(id:number){

    if(!confirm(
      "Biztosan törlöd a csoportot?"
    )){
      return;
    }


    this.groupService.deleteGroup(id)
      .subscribe(()=>{

        this.groups =
          this.groups.filter(
            x=>x.id!==id
          );

        this.cdr.markForCheck();

      });


  }



}
