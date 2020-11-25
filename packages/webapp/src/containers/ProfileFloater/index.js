import Floater from "react-floater";
import React from "react";
import PureProfileFloater from "../../components/ProfileFloater";
import history from '../../history';
export default function ProfileFloater({auth, children, openProfile, showSwitchFarm, closeInteraction}) {
  const helpClick = () => {
  }
  const switchFarmClick = () => {
    history.push('/farm_selection');
    closeInteraction('profile');
  }
  const logOutClick = () => {
    auth.logout();
  }
  const myInfoClick = () => {
    history.push('/Profile');
    closeInteraction('profile');
  }
  const Wrapper = (
    <PureProfileFloater onHelp={helpClick} onInfo={myInfoClick} onLogout={logOutClick} onSwitchFarm={switchFarmClick} showSwitchFarm={showSwitchFarm} />
  )
  return (
    <Floater component={Wrapper} placement={'bottom-end'} open={openProfile}>
      {children}
    </Floater>
  )
}
