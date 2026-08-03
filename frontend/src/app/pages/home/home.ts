import {Component, OnInit} from '@angular/core';
import {GroupCard} from '../../components/group-card/group-card';
import {DictionaryGroupCard} from '../../core/models/dictionary-group-card';
import {DictionaryGroupService} from '../../core/services/dictionary-group.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GroupCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  groups:DictionaryGroupCard[] = [];

  constructor(private groupService:DictionaryGroupService){}


  ngOnInit(){

    this.loadGroups();

  }



  loadGroups(){

    this.groupService.getMyGroups()
      .subscribe({

        next:data=>{
          this.groups=data;
        },


        error:error=>{
          console.log(error);
        }


      });


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

      });


  }
}
