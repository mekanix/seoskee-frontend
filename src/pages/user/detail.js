import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'store'

import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from '@material-ui/core'

import NoPage from 'pages/nopage'
import Template from 'templates/default'
import styles from './styles'


class UserDetail extends React.Component {
  constructor(props) {
    super(props)
    props.store.user.fetch(props.match.params.id)
    props.store.role.fetchAll()
  }

  handleRoleActive = (role) => (event, value) => {
    if (value) {
      this.props.store.user.assign(role.id)
    } else {
      this.props.store.user.deassign(role.id)
    }
  }

  render() {
    let roleList
    const { me, role, user } = this.props.store
    if (role.list.data.length === 0) {
      roleList = null
    } else if (user.detail.roles.length === 0) {
      roleList = null
    } else {
      roleList = role.list.data.map(role => {
        const activated = user.detail.roles.filter(
          userRole => userRole.id === role.id,
        ).length > 0
        return (
          <ListItem key={role.id} style={styles.item} dense button>
            <Avatar style={styles.avatar}>{role.id}</Avatar>
            <ListItemText primary={role.name} />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleRoleActive(role)}
                checked={activated}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )
      })
    }
    return me.detail.admin
      ? (
        <Template secure>
          email: {user.detail.email}
          <List>
            {roleList}
          </List>
        </Template>
      )
      : <NoPage secure />
  }
}


UserDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  store: PropTypes.shape({
    user: PropTypes.shape({
      detail: PropTypes.shape({
        email: PropTypes.string.isRequired,
      }).isRequired,
      fetch: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
}


export default withStore(UserDetail)

