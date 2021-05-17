import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent'

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
    })
  }, []) //[] ensures that this will only run once, I think because activities is not populated, it will happen in the state

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity(){
      setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true); 

    if(activity.id){//creat,ing
      console.log(activity);
      agent.Activities.update(activity).then(() => {

        console.log('here 1');
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        console.log('here 2');
        setSelectedActivity(activity);
        console.log('here 3');
        setEditMode(false);
        setSubmitting(false); 
        console.log('here 4');

      })
    } else { //updating
        activity.id = uuid();
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity])
            setSelectedActivity(activity);
            setEditMode(false);
            setSubmitting(false);
        })
    }
  }


  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then( () => {
      setActivities([...activities.filter((x => x.id !== id))])
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingComponent content='Loading app'/>

  return (
    <>
        <NavBar openForm={handleFormOpen}/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard 
            activities={activities} 
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            editMode={editMode}
            openForm= {handleFormOpen}
            closeForm = {handleFormClose}
            createOrEdit = {handleCreateOrEditActivity}
            deleteActivity = {handleDeleteActivity}
            submitting = {submitting}
          />
        </Container>
    </>
  );

  
}

export default App;
