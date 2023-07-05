import React, { useEffect, useState } from 'react'
import {baseUrl, getVoucherData} from 'src/components/CommonComponent'

const companyDetail = (props) => {
    const [companyDetails,setCompanyDetails] = useState(props);
    const { id } = props
    useEffect(() => {
        displayData();
    },[props]);
    
    const displayData = async (props) => {
        const response = await getVoucherData(''+baseUrl+'/companies/'+id+'');
        const data = await response.data.data;
        setCompanyDetails(data)
        
    }
    let filtered = [];
    return (
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Package Name</th>
                            <th class="text-center">Allowed Url</th>
                            <th class="text-center">Webhook Url</th>
                            <th class="text-center">No of Instances Allowed</th>
                            <th class="text-center">Message Allowed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{companyDetails[0]?.name}</td>
                            <td>{companyDetails[0]?.packageDetail[0]?.name}</td>
                            <td>{companyDetails[0]?.allowedUrl}</td>
                            <td>{companyDetails[0]?.webhook}</td>
                            <td class="text-center">{companyDetails[0]?.instanceAllowed}</td>
                            <td class="text-center">{companyDetails[0]?.packageDetail[0]?.messagesAllowed}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th colSpan={4}>Instance Detail</th>
                        </tr>
                        <tr>
                            <th class="text-center">Id</th>
                            <th class="text-center">Name</th>
                            <th class="text-center">Phone</th>
                            <th class="text-center">Status</th>
                            <th class="text-center">Send Message</th>
                            <th class="text-center">Remaining Message</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        companyDetails[0]?.instances?.map((instanceDetail) => (
                            <tr>
                                <td>{instanceDetail?._id}</td>
                                <td>{instanceDetail?.name}</td>
                                <td class="text-center">{instanceDetail?.phone}</td>
                                <td class="text-center">{instanceDetail.status ? ('Connected') : ('Disconnected')}</td>
                                <td class="text-center">
                                    {/* {
                                        filtered = companyDetails[0]?.messageDetail?.filter(msgDetail => (
                                            msgDetail?.['instanceId'] === instanceDetail?._id
                                        ))
                                    }
                                    {
                                        companyDetails[0]?.messageDetail.length
                                    } */}
                                </td>
                                <td class="text-center"></td>
                            </tr>  
                        ))
                    }  
                        
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}
export default companyDetail