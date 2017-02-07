import {Job} from "./job";
import {AbstractGCallout} from "./generium/abstract-gcallout";
import {Equipment} from "./equipment";
import {Requirement} from "./requirement";
import {CalendarSlot} from "./calendar-slot";
import {Quality} from "./quality";
import {Language} from "./language";

export class Offer extends AbstractGCallout {
  'class': string;
  idOffer: number;
  title: string;

  videolink: string;
  jobData: Job;
  parametrageConvention: number;

  calendarData: Array <CalendarSlot> = [];
  qualityData: Array <Quality> = [];
  languageData: Array <Language> = [];
  requirementData: Requirement[];
  equipmentData: Equipment[];

  visible: boolean;
  telephone: string;
  contact: string;
  status: string;
  nbPoste: number;
  etat: string;
  rechercheAutomatique: boolean;
  obsolete: boolean;
  identity: number;
  adresse: string;
  jobyerId: number;
  entrepriseId: number;
  hunterId:number;

  constructor() {
    super('com.vitonjob.callouts.offer.model.OfferData');

    this.idOffer = 0;
    this.jobData = null;
    this.parametrageConvention = 0;
    this.calendarData = [];
    this.qualityData = [];
    this.languageData = [];
    this.requirementData = [];
    this.equipmentData = [];
    this.visible = false;
    this.title = "";
    this.status = "open";
    this.videolink = "";
    this.nbPoste = 1;
    this.telephone = "";
    this.contact = "";
    this.etat = "";
    this.rechercheAutomatique = false;
    this.obsolete = false;
    this.identity = 0;
    this.adresse = "";
    this.jobyerId = 0;
    this.entrepriseId = 0;
    this.hunterId = 0;
  }
}