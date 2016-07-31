import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, Alert} from 'ionic-angular';
import {Configs} from '../../configurations/configs';
import {GlobalConfigs} from '../../configurations/globalConfigs';
import {LoadListService} from "../../providers/load-list.service";
import {ValidationDataService} from "../../providers/validation-data.service";
import {DataProviderService} from "../../providers/data-provider.service";
import {GlobalService} from "../../providers/global.service";

@Component({
  templateUrl: 'build/pages/modal-recruiter-manual/modal-recruiter-manual.html',
  providers: [LoadListService, ValidationDataService, DataProviderService, GlobalService]
})
export class ModalRecruiterManualPage {
	projectTarget:string;
    isEmployer:boolean;
    themeColor:string;
	currentUser: any;
	modalTitle: string;
	lastname: string;
	firstname: string;
	index: int;
	phone: int;
	//email: string;
	isPhoneNumValid = true;
	phoneExist = false;
	
	constructor(public nav: NavController,
				params: NavParams,
				public gc: GlobalConfigs,
				private viewCtrl: ViewController,
				private loadListService: LoadListService, 
				private validationDataService: ValidationDataService,
				private dataProviderService: DataProviderService, 
				private globalService: GlobalService) {
		// Get target to determine configs
        this.projectTarget = gc.getProjectTarget();
        // get config of selected target
        let config = Configs.setConfigs(this.projectTarget);
        // Set store variables and messages
        this.themeColor = config.themeColor;
        this.isEmployer = (this.projectTarget=='employer');			
		this.modalTitle = "Détail du contact"
		this.index = "33";
		if(params.data.contact)
			this.initializeForm(params.data.contact);
	}
	initializeForm(contact){
		this.firstname = contact.firstname;
		this.lastname = contact.lastname;
		this.index = this.splitPhoneNumber(contact.phone)[0];
		this.phone = this.splitPhoneNumber(contact.phone)[1];
		//this.email = contact.email;
		this.accountid = contact.accountid;
	}
	
	saveContact(){
		var contact = {};
		contact.firstname = this.firstname;
		contact.lastname = this.lastname;
		contact.phone = "+" + this.index + "" + this.phone;
		//contact.email = this.email;
		contact.accountid = this.accountid;
		this.viewCtrl.dismiss(contact);
	}
	
	doRadioAlert() {
		let alert = Alert.create();
		alert.setTitle('Choisissez votre pays');
		//load countries list
		this.loadListService.loadCountries(this.projectTarget).then((data) => {
			this.pays = data.data;
			for (let p of this.pays) {
				alert.addInput({
					type: 'radio',
					label: p.nom,
					value: p.indicatif_telephonique,
					//france code by default checked
					checked: p.indicatif_telephonique == '33'
				});
			}
			alert.addButton('Annuler');
			alert.addButton({
				text: 'Ok',
				handler: data => {
					this.index = data;
				}
			});
			this.nav.present(alert);
		});
	}
	
	watchPhone(e) {
		if (this.phone) {
			this.isPhoneNumValid = false;
			if (e.target.value.substring(0,1) == '0') {
				e.target.value = e.target.value.substring(1, e.target.value.length);
			}
			if (e.target.value.indexOf('.') != -1) {
				e.target.value = e.target.value.replace('.', '');
			}
			if(e.target.value.length > 9){
				e.target.value = e.target.value.substring(0, 9);
			}
			if (e.target.value.length == 9) {
				this.doesPhoneExist(e.target.value);
				this.isPhoneNumValid = true;
			}
			this.phone = e.target.value;
		}
	}
	
	doesPhoneExist(phone){
		if (this.isPhoneValid(phone)) {
			var tel = "+" + this.index + phone;
			this.dataProviderService.getUserByPhone(tel, this.projectTarget).then((data) => {
				if (!data || data.status == "failure") {
					console.log(data);
					this.globalService.showAlertValidation("VitOnJob", "Serveur non disponible ou problème de connexion.");
					return;
				}
				if (!data || data.data.length == 0) {
					this.phoneExist = false;
				} else {
					this.phoneExist = true;
				}
			});
		}
	}
	
	isPhoneValid(tel) {
		if (this.phone) {
			var phone_REGEXP = /^0/;
			//check if the phone number start with a zero
			var isMatchRegex = phone_REGEXP.test(tel);
			if (Number(tel.length) == 9 && !isMatchRegex) {
				console.log('phone number is valid');
				return true;
			}
			else
			return false;
		} else
		return false;
	}
	
	splitPhoneNumber(num){
		var len = num.length;
		var index = num.substring(0, len - 9);
		if(index.startsWith("00")){
			index = index.substring(2, len - 9);
		}
		if(index.startsWith("+")){
			index = index.replace("+", "");
		}
		if(index == 0){
			index = "";
		}
		var phone = num.substring(len - 9, len);
		return [index, phone];
	}
	
	showEmailError() {
		if(this.email)
		return !(this.validationDataService.checkEmail(this.email));
		else
		return false
	}
	
	sendNotification(){
		var contact = {};
		contact.firstname = this.firstname;
		contact.lastname = this.lastname;
		contact.phone = "+" + this.index + "" + this.phone;
		//contact.email = this.email;
		contact.accountid = this.accountid;
		this.viewCtrl.dismiss([contact, "notification"]);
	}
	
	isUpdateDisabled(){
		return (!this.index || !this.phone || !this.isPhoneNumValid || this.phoneExist || (!this.firstname && !this.lastname));
	}
	
	closeModal() {
		this.viewCtrl.dismiss();
	}
}