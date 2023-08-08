import React from 'react'
import 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js'
import { 
    CContainer,
    CRow,
    CCol
   } from '@coreui/react'   
import { baseUrlTwo } from 'src/components/CommonComponent';

const ConnectInstanceForm = (props) => {
    const { id } = props
    var socket = io.connect( baseUrlTwo ,{query:'token='+id});
    socket.on('init', function(data) {
        if(data) {	
            $('.client-container .client').not(':first').remove();			
            var clientId = data.id;
            var clientDescription = 'Client Details: ' +  data.name;
            if(data.phone) {
                clientDescription = clientDescription + ' ('+ data.phone +')';
            }
            
            var clientClass = 'client-' + clientId;
            var template = $('.client').first().clone().removeClass('hide').addClass(clientClass);

            template.find('.title').html(clientId);
            template.find('.description').html(clientDescription);
            $('.client-container').append(template);
            $(`.client.${clientClass} .logs`).prepend($('<li>').text('Connecting...'));
        }
        console.log('init');
    });
    socket.on('qr', function(data) {
        $(`.client.client-${data.id} #qrcode`).attr('src', data.src);
        $(`.client.client-${data.id} #qrcode`).show();
    });
    socket.on('ready', function(data) {
        data.status ? window.location.reload(true) : console.log('False');
        $(`.client.client-${data.id} #qrcode`).hide();
    });

    socket.on('authenticated', function(data) {
        $(`.client.client-${data.id} #qrcode`).hide();
    });
                
    socket.on('message', function(data) {
        if(data.name){
            var clientDescription = 'Client Details: ' +  data.name;
            if(data.phone) {
                clientDescription = clientDescription + ' ('+ data.phone +')';
            }
            $(`.client.client-${data.id} .description`).html(clientDescription);
        }
        $(`.client.client-${data.id} .logs`).prepend($('<li>').text(data.text));
        console.log('message');
    });
    socket.on('remove-session', function(id) {
        $(`.client.client-${id}`).remove();
        window.location.reload(true);
        console.log('remove-session');
    });
    return (
    
        <>
            <CContainer>
                <CRow className="justify-content-center text-center">
                    <CCol md={8}>
                        <div class="client-container">
                            <div class="client hide">
                                <img src="" alt="QR Code" id="qrcode" />
                            </div>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

export default ConnectInstanceForm
