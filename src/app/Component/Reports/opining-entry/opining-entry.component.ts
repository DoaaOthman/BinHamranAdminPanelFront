import { Component, OnInit } from '@angular/core';
import { BranchModule } from 'src/app/Models/DataModels/branch/branch.module';
import { AccountModule } from 'src/app/Models/DataModels/account/account.module';
import { DatabaseModule } from 'src/app/Models/DataModels/database/database.module';
import { NgForm } from '@angular/forms';
import { DateHelperService } from 'src/app/Helper/date-helper.service';
import { ReportsServiceService } from 'src/app/Services/Reports/reports-service.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EntryModule } from 'src/app/Models/DataModels/entry/entry.module';

@Component({
  selector: 'app-opining-entry',
  templateUrl: './opining-entry.component.html',
  styleUrls: ['./opining-entry.component.css']
})
export class OpiningEntryComponent implements OnInit {

  result: any;
  ToDate: any;
  DateHijri: any;
  PortfolioID: number;
  dbIds: string;
  ComIDS: string;
  AccIDs: string;
  DbObj: DatabaseModule = new DatabaseModule();
  CBObj: BranchModule = new BranchModule();
  AccObj: AccountModule = new AccountModule();
  EntObj: EntryModule = new EntryModule();
  DbNames: DatabaseModule[];
  Accounts: AccountModule[];
  Entries: EntryModule[];
  Branches: BranchModule[];
  PortfolioNameARtxt: string = '';
  PageName: string;
  ToastrMsg: string;
  // options: any = new Stimulsoft.Designer.StiDesignerOptions();
  // viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);
  // report: any = new Stimulsoft.Report.StiReport();
  // designer: any = new Stimulsoft.Designer.StiDesigner(this.options, 'StiDesigner', false);

  public iconFieldsPort: Object = {};
  public iconWaterMarkPort: string = "";
  constructor(private ReportSer: ReportsServiceService, private toastr: ToastrService,
    private router: Router, private datehelp: DateHelperService, private translate: TranslateService) { }

  ngOnInit() {
    this.toastr.warning(this.ToastrMsgTranslate("ToastrMsg.Reporttoster"), this.PageName);
    this.ToDate = 2019;
    this.BreadCrumTranslate();
    this.SelectDatabase();
    

  }
  PickCom(event){
    debugger;
    this.ComIDS = event[0].COM_BRN_CODE;
    for(var i = 1; i< event.length ; i++)
    {
      var id= event[i].COM_BRN_CODE;
      this.ComIDS += ','+ id;
    }

  }
  PickAcc(event){
    debugger;
    this.AccIDs = event[0].ACC_ID;
    for(var i = 1; i< event.length ; i++)
    {
      var id= event[i].ACC_ID;
      this.AccIDs += ','+ id;
    }
  }
  pick(event){
    debugger;
    this.dbIds = event[0].DatabaseNameId;
    for(var i = 1; i< event.length ; i++)
    {
      var id= event[i].DatabaseNameId;
      this.dbIds += ','+ id;
    }

    this.SelectBranches();
  }
  BreadCrumTranslate() {
    debugger;
    this.translate.get(["ResultOfPortPage.breadcrumb"])
      .subscribe((translations: string) => {
        this.PageName = translations["ResultOfPortPage.breadcrumb"];
      });

  }
  // Translate Toastr MSg
  ToastrMsgTranslate(Msg: string) {
    this.translate.get([Msg])
      .subscribe((translations: string) => {
        this.ToastrMsg = translations[Msg];
      });
    return this.ToastrMsg;
  }
  Submit(frm: NgForm) {
    debugger;
    this.ViewReport();
  }

  ViewReport() {
    debugger;
    this.ToDate = (<HTMLInputElement>document.getElementById("gregDate"))
      .value ? (<HTMLInputElement>document.getElementById("gregDate")).value : null;
    this.ReportSer.OpeningEntries(this.ToDate, this.ComIDS, this.dbIds).subscribe(
      (data: Response) => {
        debugger;
        this.result = data;
        this.router.navigate(['/ViewReport', { 'Reportview': this.result }]);
      },
      err => {
        this.toastr.error(this.ToastrMsgTranslate("ToastrMsg.UnExpError"), this.PageName);
      }
    );
  }
  EditReport() {

    this.router.navigate(['/editreports', { 'ReportEdit': 'OpeningEntries.mrt' }]);
    debugger;
    // this.ToDate = (<HTMLInputElement>document.getElementById("gregDate")).value?(<HTMLInputElement>document.getElementById("gregDate")).value:null;
    // this.ReportSer.EditResultOfPortofolioWork(this.ToDate,this.PortfolioID).subscribe(
    //   (data: Response)=>{
    //     debugger;
    //   this.result=data;
    // this.report.loadFile("http://localhost:56296/UploadFiles/RPTResultOfPortofolioWork.mrt");

    //   this.designer.onSaveReport = function (args) {
    //     var report = args.report;
    //     report.saveFile("http://localhost:56296/UploadFiles/RPTResultOfPortofolioWork.mrt");
    //   }
    //    this.options.appearance.fullScreenMode = true;

    //    this.designer.report = this.report;
    //    this.designer.renderHtml("designer");

    //   },
    //   err=>{
    //     this.toastr.error(this.ToastrMsgTranslate("ToastrMsg.UnExpError"),this.PageName);
    //   }
    // );
  }

  onSelectPortfolio(selectedItem: any, modalId: any) {
    debugger;
    this.PortfolioID = selectedItem.PortfolioID ? selectedItem.PortfolioID : 0;
    this.PortfolioNameARtxt = selectedItem.NameAR ? selectedItem.NameAR : '';
  }

  SelectDatabase() {
    debugger;
    this.ReportSer.GetDbNames().subscribe(
      res => {
        // this.portfolios=res as Portfolio[] ;
        debugger;
        this.DbNames = res as DatabaseModule[];
      },
      err => {
        this.toastr.error(this.ToastrMsgTranslate("ToastrMsg.UnExpError"), this.PageName);

      }
    );
  }
  
  SelectBranches() {
    debugger;

    this.ReportSer.GetCompanyBranches(this.dbIds).subscribe(
      res => {
        // this.portfolios=res as Portfolio[] ;

        this.Branches = res as BranchModule[];


      },
      err => {
        this.toastr.error(this.ToastrMsgTranslate("ToastrMsg.UnExpError"), this.PageName);

      }
    );
  }



}
