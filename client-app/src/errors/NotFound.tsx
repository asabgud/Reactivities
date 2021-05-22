import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound(){

    return(
        <Segment placeholder>
            <Header>
                <Icon name='search' />
                Opps - we've loegged everywhere and could not find this. 
                <Segment.Inline>
                    <Button as={Link} to='activities' primary>
                        Return to activities page;
                    </Button>
                </Segment.Inline>
            </Header>
        </Segment>


    )
}