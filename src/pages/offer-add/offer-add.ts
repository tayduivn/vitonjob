import {
  NavController,
  NavParams,
  ToastController,
  ModalController,
  LoadingController,
  AlertController,
  ViewController
} from "ionic-angular";
import {GlobalConfigs} from "../../configurations/globalConfigs";
import {Configs} from "../../configurations/configs";
import {ModalJobPage} from "../modal-job/modal-job";
import {ModalQualityPage} from "../modal-quality/modal-quality";
import {ModalLanguagePage} from "../modal-language/modal-language";
import {ModalCalendarPage} from "../modal-calendar/modal-calendar";
import {OffersService} from "../../providers/offers-service/offers-service";
import {OfferListPage} from "../offer-list/offer-list";
import {Component} from "@angular/core";
import {NotificationContractPage} from "../notification-contract/notification-contract";
import {HomePage} from "../home/home";
import {Storage} from "@ionic/storage";
import {Utils} from "../../utils/utils";
import {AdvertService} from "../../providers/advert-service/advert-service";
import {AdvertListPage} from "../advert-list/advert-list";

/*
 Generated class for the OfferAddPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'offer-add.html',
  selector: 'offer-add'
})
export class OfferAddPage {

  public themeColor: string;
  public inversedThemeColor: string;
  public isEmployer: boolean;
  public steps: any;
  public validated: {
    isJob: boolean,
    isQuality: boolean,
    isLanguage: boolean,
    isCalendar: boolean
  };
  public offerService: OffersService;
  public visibleOffer: boolean;
  public offerToBeAdded: {jobData: any, calendarData: any, qualityData: any, languageData: any,
    visible: boolean, title: string, status: string, idHunter: number, videolink: string};
  public backgroundImage: any;
  public jobData: any;
  public idTiers: number;
  public projectTarget: any;
  public isHunter: boolean = false;
  public idHunter: number = 0;
  public backGroundColor: string;

  //advert management
  public advertId: string;

  constructor(public nav: NavController,
              private gc: GlobalConfigs,
              private os: OffersService,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              public alert: AlertController,
              public modal: ModalController,
              public toast: ToastController,
              public advertService: AdvertService,
              public loading: LoadingController, public storage: Storage) {

    // Set global configs
    // Get target to determine configs
    this.projectTarget = gc.getProjectTarget();
    this.isHunter = gc.getHunterMask();

    // get config of selected target
    let config = Configs.setConfigs(this.projectTarget);
    this.backGroundColor = config.backGroundColor;

    //Initializing PAGE:
    this.initializePage(config);
    this.offerService = os;


    this.storage.get(config.currentUserVar).then((value) => {
      if (value) {
        let currentUser = JSON.parse(value);
        this.idTiers = this.projectTarget == 'employer' ? currentUser.employer.entreprises[0].id : currentUser.jobyer.id;
        this.idHunter = currentUser.hunterId;
        this.offerToBeAdded.idHunter = this.idHunter;
      }
    });
  }


  /**
   * @Author : TEL
   * #Description : Initializing Offer adding buttons
   */
  initializePage(config) {
    // Set local variables
    this.themeColor = config.themeColor;
    this.inversedThemeColor = config.inversedThemeColor;
    this.backgroundImage = config.backgroundImage;
    this.isEmployer = (this.projectTarget === 'employer');

    this.validated = {
      isJob: false,
      isQuality: false,
      isLanguage: false,
      isCalendar: false
    };

    this.steps = {
      isJob: true,
      isQuality: false,
      isLanguage: false,
      isCalendar: false,
      styleDisableJob: {},
      styleDisableCalendar: {},
      styleDisableQuality: {},
      styleDisableLanguage: {}
    };

    this.steps.styleDisableCalendar.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;
    this.steps.styleDisableJob.opacity = (this.steps.isJob) ? 1 : 0.5;
    this.steps.styleDisableLanguage.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;
    this.steps.styleDisableQuality.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;


    this.visibleOffer = false;

    this.offerToBeAdded = {
      jobData: {}, calendarData: [], qualityData: [], languageData: [],
      visible: this.visibleOffer, title: "", status: "open", idHunter: 0, videolink: ""

    };

    this.initLocalStorageOffer();


  }

  /**
   * @description Initializing local storage dara
   */
  initLocalStorageOffer() {
    // --> Job state
    this.storage.get('jobData').then(value => {
      value = JSON.parse(value);
      if (value) {
        this.offerToBeAdded.jobData = value;
        let level = (this.offerToBeAdded.jobData.level === 'senior') ? 'Expérimenté' : 'Débutant';
        this.offerToBeAdded.title = this.offerToBeAdded.jobData.job + " " + level;
        this.validated.isJob = value.validated;
        this.steps.isCalendar = this.validated.isJob;
        this.steps.styleDisableCalendar.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;
      }
      // --> Calendar state
      this.storage.get('slots').then(value => {
        value = JSON.parse(value);
        if (value) {
          this.offerToBeAdded.calendarData = value;
          this.validated.isCalendar = value.length > 0;
          this.steps.isQuality = this.validated.isCalendar;
          this.steps.styleDisableQuality.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;
        }

        // --> Quality state
        this.storage.get('qualities').then(value => {
          value = JSON.parse(value);
          if (value) {
            this.offerToBeAdded.qualityData = value;
            this.validated.isQuality = value.length > 0;
            this.steps.isLanguage = this.validated.isQuality;
            this.steps.styleDisableQuality.opacity = !(this.validated.isCalendar && this.validated.isJob) ? 0.5 : 1;
          }
          // --> Language state
          this.storage.get('languages').then(value => {
            value = JSON.parse(value);
            if (value) {
              this.offerToBeAdded.languageData = value;
              this.validated.isLanguage = value.length > 0;
              this.steps.styleDisableLanguage.opacity = !(this.validated.isCalendar && this.validated.isJob) ? 0.5 : 1;
            }
          });
        });
      });
    });
  }

  /** ########### Toast #############*/

  /**
   * @description Present the global toast that validate offer-list insertion
   * @param message
   * @param duration
   */
  presentToast(message: string, duration: number) {
    let toast = this.toast.create({
      message: message,//"Agenda bien insérée, Votre offre est valide",
      duration: duration * 1000
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      //this.isOfferValidated = (!this.isOfferValidated);
    });

    toast.present();
  }

  /**########## Modals #############*/

  /**
   * Create Job modal
   */

  showJobModal() {
    this.storage.get('jobData').then(value => {
      console.log(value);
      let modal = this.modal.create(ModalJobPage, {jobData: JSON.parse(value)});
      modal.present();
      modal.onDidDismiss((data: {validated: boolean, isJob: boolean}) => {
        this.jobData = data;
        this.validated.isJob = data.validated;
        this.steps.isCalendar = this.validated.isJob;
        this.steps.styleDisableCalendar.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;
        this.steps.styleDisableQuality.opacity = !(this.validated.isCalendar && this.validated.isJob) ? 0.5 : 1;
        this.steps.styleDisableLanguage.opacity = !(this.validated.isCalendar && this.validated.isJob) ? 0.5 : 1;
        this.storage.set('jobData', JSON.stringify(data));
      })
    });
  }

  /**
   * Create Qualities modal
   */
  showQualityModal() {

    if (this.validated.isCalendar && this.validated.isJob) {
      this.storage.get('qualities').then(value => {
        let modal = this.modal.create(ModalQualityPage, {qualities: JSON.parse(value)});
        modal.present();
        modal.onDidDismiss((data: any) => {
          this.validated.isQuality = (data.length) ? data.length > 0 : false;
          //this.steps.isLanguage = this.validated.isQuality;
          this.storage.set('qualities', JSON.stringify(data));
        })
      });
    }
  }

  /**
   * Create Language modal
   */
  showLanguageModal() {
    if (this.validated.isCalendar && this.validated.isJob) {
      this.storage.get('languages').then(value => {
        let modal = this.modal.create(ModalLanguagePage, {languages: JSON.parse(value)});
        modal.present();
        modal.onDidDismiss((data: any) => {
          this.validated.isLanguage = (data.length) ? data.length > 0 : false;
          //this.steps.isCalendar = this.validated.isLanguage;
          this.storage.set('languages', JSON.stringify(data));
          if (this.validated.isLanguage && this.validated.isQuality)
            this.presentToast("Félicitations, votre offre est complète. Vous pouvez la valider pour l'enregistrer.", 4);
        })
      });
    }
  }

  /**
   * Create Calendar modal
   */
  showCalendarModal() {
    if (this.validated.isJob) {
      this.storage.get('slots').then(value => {
        let modal = this.modal.create(ModalCalendarPage, {slots: JSON.parse(value), obj: "add"});
        modal.present();
        modal.onDidDismiss((data: any) => {
          this.validated.isCalendar = (data.slots.length) ? data.slots.length > 0 : false;
          this.steps.isCalendar = this.validated.isCalendar;
          this.steps.styleDisableCalendar.opacity = (!this.steps.isCalendar && !this.validated.isJob) ? 0.5 : 1;
          this.steps.styleDisableQuality.opacity = !(this.validated.isCalendar && this.validated.isJob) ? 0.5 : 1;
          this.steps.styleDisableLanguage.opacity = !(this.validated.isCalendar && this.validated.isJob) ? 0.5 : 1;
          this.storage.set('slots', JSON.stringify(data.slots));
          if (this.validated.isCalendar && this.validated.isQuality)
            this.presentToast("Vous pouvez ajouter votre nouvelle offre dès maintenant! " +
              "Pour plus de précision pensez à saisir les qualités et langues...", 3);
        })
      });
    }

  }

  /**
   * Description : Adding offer in local and remote databases
   */
  addOffer() {
    this.initLocalStorageOffer();
    let loading = this.loading.create({
      content: ` 
			<div>
			<img src='assets/img/loading.gif' />
			</div>
			`,
      spinner: 'hide',
      duration: 10000
    });
    loading.present();
    this.offerService.setOfferInLocal(this.offerToBeAdded, this.projectTarget)
      .then(() => {
        console.log('••• Adding offer : local storing success!');

        this.offerService.setOfferInRemote(this.offerToBeAdded, this.projectTarget)
          .then((data: {_body: any}) => {
            console.log('••• Adding offer : remote storing success!');
            let offer = JSON.parse(data._body);
            //debugger;
            if (this.jobData && this.jobData.adress) {
              this.offerService.saveOfferAdress(offer, this.jobData.adress, this.jobData.adress.streetNumber, this.jobData.adress.street,
                this.jobData.adress.city, this.jobData.adress.zipCode, this.jobData.adress.name, this.jobData.adress.country, this.idTiers, this.projectTarget);
            }
            this.storage.clear();
            loading.dismiss();

            //decide to which page redirect to
            let fromPage = this.navParams.data.fromPage;
            let searchRes = this.navParams.data.jobyer;
            let obj = this.navParams.data.obj;
            this.advertId = this.navParams.data.adv;

            if (fromPage == "Search" || obj == "forRecruitment") {
              this.nav.push(NotificationContractPage, {
                jobyer: searchRes,
                currentOffer: this.offerToBeAdded
              }).then(() => {
                // first we find the index of the current view controller:
                const index = this.viewCtrl.index;
                // then we remove it from the navigation stack
                this.nav.remove(index);
              });
            } else if (this.isHunter) {
              this.nav.setRoot(HomePage);
            } else if(!Utils.isEmpty(this.advertId)){
              this.advertService.updateAdvertWithOffer(this.advertId, offer.idOffer).then((data: any) => {
                this.nav.setRoot(AdvertListPage);
              });
            } else {
              this.nav.setRoot(OfferListPage);
            }
          });
      });
  }

  showVideoAlert() {
    let prompt = this.alert.create({
      title: 'Attacher une vidéo',
      message: "<div id='alertDiv'><ol><li>Ouvrez l'application Youtube </li>" +
      "<li>Appuyez sur l'icône de <b>caméra</b> <img src='../assets/img/youtube.png'></li>" +
      "<li>Enregistrez une nouvelle vidéo ou sélectionnez-en une existante</li>" +
      "<li>Renseignez le titre, la description et choisissez l'option '<b>Non répertoriée</b>' dans la confidentialité</li>" +
      "<li>Appuyez sur <img src='../assets/img/youtube2.png'> pour mettre en ligne votre vidéo</li>" +
      "<li>Appuyez sur <img src='../assets/img/youtube3.png'><b> > Partager > Copier le lien</b></li>" +
      "<li>Coller le lien dans la zone ci-dessous:</li></ol></div>",
      inputs: [
        {
          name: 'videolink',
          placeholder: 'Lien youtube'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: data => {
            console.log('Saved clicked');
            this.storage.set('videolink', data["videolink"]);
            this.offerToBeAdded.videolink = data["videolink"];
          }
        }
      ]
    });
    prompt.present();
  }
}
