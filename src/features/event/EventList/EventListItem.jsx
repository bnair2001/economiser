import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
//import EventListAttendee from './EventListAttendee'
import format from 'date-fns/format'
//import { objectToArray } from '../../../app/common/util/helpers'

class EventListItem extends Component {
  
  render() {
    const {event} = this.props
    
    return (
      
    <Segment.Group as={Link} to={`/event/${event.id}`} >
        <Segment>
          <Item.Group>
            <Item>
              {/* <Item.Image size="tiny" circular src={event.hostPhotoURL} /> */}
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>{event.title}</Item.Header>
                {/* <Item.Description>
                  Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                </Item.Description> */}
                {event.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This Transaction has been temp_removed'/>}
              </Item.Content>
              
              
              <Item.Content>
              
          </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(event.date.toDate(), 'dddd Do MMMM')} at {format(event.date.toDate(), 'HH:mm')}|
            {/* <Icon name="marker" /> {event.venue} */}
          </span>
        </Segment>
        
        <Segment clearing>
        <span>&#8377;{event.description}</span>
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
