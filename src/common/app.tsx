import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import EntryIndexContainer from "./pages/index";
import EntryContainer from "./pages/entry";
import { SearchPageContainer, SearchMorePageContainer } from "./pages/search";
import { ProposalsIndexContainer, ProposalDetailContainer } from "./pages/proposals";
import NotFound from "./components/404";
import Tracker from "./tracker";
import {
  AboutPage,
  GuestPostPage,
  ContributePage,
  PrivacyPage,
  WhitePaperPage,
  TosPage,
  FaqPage,
  ContributorsPage,
  GettingStartedWithUpvuPage,
} from "./pages/static";
import routes from "./routes";
import * as ls from "./util/local-storage";
import i18n from "i18next";
import { pageMapDispatchToProps, pageMapStateToProps } from "./pages/common";
import { connect } from "react-redux";
import loadable from "@loadable/component";
import { useLocation } from "react-router";

const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || "UA-250883873-1";

// Define lazy pages
const ProfileContainer = loadable(() => import("./pages/profile-functional"));
const ProfilePage = (props: any) => <ProfileContainer {...props} />;

const CommunityContainer = loadable(() => import("./pages/community"));
const CommunityPage = (props: any) => <CommunityContainer {...props} />;

const DiscoverContainer = loadable(() => import("./pages/discover"));
const DiscoverPage = (props: any) => <DiscoverContainer {...props} />;

const EcosystemContainer = loadable(() => import("./pages/ecosystem"));
const EcosystemPage = (props: any) => <EcosystemContainer {...props} />;

const WitnessesContainer = loadable(() => import("./pages/witnesses"));
const WitnessesPage = (props: any) => <WitnessesContainer {...props} />;

const AuthContainer = loadable(() => import("./pages/auth"));
const AuthPage = (props: any) => <AuthContainer {...props} />;

const SubmitContainer = loadable(() => import("./pages/submit"));
const SubmitPage = (props: any) => <SubmitContainer {...props} />;

const MarketContainer = loadable(() => import("./pages/market"));
const MarketPage = (props: any) => <MarketContainer {...props} />;

const SignUpContainer = loadable(() => import("./pages/sign-up"));
const SignUpPage = (props: any) => <SignUpContainer {...props} />;

const CommunitiesContainer = loadable(() => import("./pages/communities"));
const CommunitiesPage = (props: any) => <CommunitiesContainer {...props} />;

const CommunityCreateContainer = loadable(() => import("./pages/community-create"));
const CommunityCreatePage = (props: any) => <CommunityCreateContainer {...props} />;

const CommunityCreateHSContainer = loadable(() => import("./pages/community-create-hs"));
const CommunityCreateHSPage = (props: any) => <CommunityCreateHSContainer {...props} />;

const EntryAMPContainer = loadable(() => import("./pages/amp/entry-amp-page"));
const EntryPage = (props: any) => {
  const [isAmp, setIsAmp] = useState(props.location.search.includes("?amps"));
  return isAmp ? <EntryAMPContainer {...props} /> : <EntryContainer {...props} />;
};

ReactGA.initialize(TRACKING_ID);

const RouteChangeTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

const App = ({ setLang }: any) => {
  const location = useLocation();

  // Fired on every route change
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);

    let pathname = window.location.pathname;
    if (pathname !== "/faq") {
      const currentLang = ls.get("current-language");
      if (currentLang) {
        setLang(currentLang);
        i18n.changeLanguage(currentLang);
      }
    }
  }, []);

  RouteChangeTracker();

  return (
    <>
      <Tracker />
      <Switch>
        <Route exact={true} path={routes.HOME} component={EntryIndexContainer} />
        <Route exact={true} strict={true} path={routes.FILTER} component={EntryIndexContainer} />
        <Route exact={true} strict={true} path={routes.USER_FEED} component={EntryIndexContainer} />
        <Route exact={true} strict={true} path={routes.USER} component={ProfilePage} />
        <Route exact={true} strict={true} path={routes.USER_SECTION} component={ProfilePage} />
        <Route exact={true} strict={true} path={routes.ENTRY} component={EntryPage} />
        <Route exact={true} strict={true} path={routes.COMMUNITIES} component={CommunitiesPage} />
        <Route exact={true} strict={true} path={routes.COMMUNITIES_CREATE} component={CommunityCreatePage} />
        <Route exact={true} strict={true} path={routes.COMMUNITIES_CREATE_HS} component={CommunityCreateHSPage} />
        <Route exact={true} strict={true} path={routes.COMMUNITY} component={CommunityPage} />
        <Route exact={true} strict={true} path={routes.FILTER_TAG} component={EntryIndexContainer} />
        <Route exact={true} strict={true} path={routes.DISCOVER} component={DiscoverPage} />
        <Route exact={true} strict={true} path={routes.ECOSYSTEM} component={EcosystemPage} />
        <Route exact={true} path={routes.SEARCH} component={SearchPageContainer} />
        <Route exact={true} path={routes.SEARCH_MORE} component={SearchMorePageContainer} />
        <Route exact={true} strict={true} path={routes.AUTH} component={AuthPage} />
        <Route exact={true} strict={true} path={routes.SUBMIT} component={SubmitPage} />
        <Route exact={true} strict={true} path={routes.MARKET} component={MarketPage} />
        <Route exact={true} strict={true} path={routes.EDIT} component={SubmitPage} />
        <Route exact={true} strict={true} path={routes.SIGN_UP} component={SignUpPage} />
        <Route exact={true} strict={true} path={routes.EDIT_DRAFT} component={SubmitPage} />
        <Route exact={true} strict={true} path={routes.WITNESSES} component={WitnessesPage} />
        <Route exact={true} strict={true} path={routes.PROPOSALS} component={ProposalsIndexContainer} />
        <Route exact={true} strict={true} path={routes.PROPOSAL_DETAIL} component={ProposalDetailContainer} />
        <Route exact={true} strict={true} path={routes.ABOUT} component={AboutPage} />
        <Route exact={true} strict={true} path={routes.GUESTS} component={GuestPostPage} />
        <Route exact={true} strict={true} path={routes.CONTRIBUTE} component={ContributePage} />
        <Route exact={true} strict={true} path={routes.PRIVACY} component={PrivacyPage} />
        <Route exact={true} strict={true} path={routes.START_UPVU} component={GettingStartedWithUpvuPage} />
        <Route exact={true} strict={true} path={routes.WHITE_PAPER} component={WhitePaperPage} />
        <Route exact={true} strict={true} path={routes.TOS} component={TosPage} />
        <Route exact={true} strict={true} path={routes.FAQ} component={FaqPage} />
        <Route exact={true} strict={true} path={routes.CONTRIBUTORS} component={ContributorsPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default connect(pageMapStateToProps, pageMapDispatchToProps)(App);
