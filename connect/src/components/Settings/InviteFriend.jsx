import React from 'react'

const InviteFriend = ({ tabIndex, index }) => {
  if (tabIndex !== undefined && index !== undefined) {
    if (tabIndex === index) {
      return (
        <div>Invite Friend</div>
      )
    }
    else {
      return (
        <></>
      )
    }
  }
}

export default InviteFriend