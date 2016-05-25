import {Page, NavController, NavParams, Loading} from 'ionic-angular';
import {GlobalConfigs} from "../../configurations/globalConfigs";
import {Configs} from "../../configurations/configs";
import {SearchResultsPage} from "../../pages/search-results/search-results";
import {OffersService} from "../../providers/offers-service/offers-service";
import {SearchService} from "../../providers/search-service/search-service";

/*
 Generated class for the OfferDetailPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Page({
    templateUrl: 'build/pages/offer-detail/offer-detail.html',
    providers: [GlobalConfigs, OffersService, SearchService]
})
export class OfferDetailPage {
    offer : any;
    constructor(public nav:NavController, gc:GlobalConfigs, params:NavParams,
                public offersService : OffersService, public searchService : SearchService) {

        // Set global configs
        // Get target to determine configs
        this.projectTarget = gc.getProjectTarget();

        // get config of selected target
        let config = Configs.setConfigs(this.projectTarget);
        // Set local variables
        this.themeColor = config.themeColor;
        this.isEmployer = (this.projectTarget === 'employer');

        // Get Offer passed in NavParams
        this.offer = params.get('selectedOffer');
        this.showJob = false;
        this.jobIconName = 'add';
        this.showQuality = false;
        this.qualityIconName = 'add';
        this.showLanguage = false;
        this.languageIconName = 'add';
        this.showCalendar = false;
        this.calendarIconName = 'add';
        // 

    }

    /**
     * @Description : Launch search from current offer-list
     */
    launchSearch () {
        console.log(this.offer);
        if(!this.offer)
            return;
        let loading = Loading.create({
            content: ` 
                <div>
                    <img src='img/loading.gif' />
                </div>
                `,
            spinner : 'hide'
        });
        this.nav.present(loading);
        this.offersService.getCorrespondingOffers(this.offer, this.projectTarget).then(data =>{
            console.log(data);
            this.searchService.persistLastSearch(data);
            loading.dismiss();
            this.nav.push(SearchResultsPage);
        });
    }


    /**
     * Show job card
     */
    showJobCard(){
        this.showJob = !(this.showJob);
        if (this.showJob)
            this.jobIconName = 'remove';
        else
            this.jobIconName = 'add';
    }

    /**
     * Show quality card
     */
    showQualityCard(){
        this.showQuality = !(this.showQuality);
        if (this.showQuality)
            this.qualityIconName = 'remove';
        else
            this.qualityIconName = 'add';
    }

    /**
     * Show language card
     */
    showLanguageCard(){
        this.showLanguage = !(this.showLanguage);
        if (this.showLanguage)
            this.languageIconName = 'remove';
        else
            this.languageIconName = 'add';
    }

    /**
     * Show calendar card
     */
    showCalendarCard(){
        this.showCalendar = !(this.showCalendar);
        if (this.showCalendar)
            this.calendarIconName = 'remove';
        else
            this.calendarIconName = 'add';
    }
}
