import React, { useEffect, useState } from 'react'
import {baseUrl, getVoucherData,numberFormat} from 'src/components/CommonComponent'

const packageDetail = (props) => {
    const [packageDetails,setPackageDetails] = useState(props);
    const [companyDetails,setCompanyDetails] = useState([]);
    const { id } = props
    useEffect(() => {
        displayData();
    },[props]);
    
    const displayData = async (props) => {
        const response = await getVoucherData(''+baseUrl+'/packages/'+id+'');
        const pData = await response.data.data.package;
        const inrolCLData = await response.data.data.inrolComList;
        setPackageDetails(pData)
        setCompanyDetails(inrolCLData)
    }
    
    return (
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">Package Name</th>
                            <th class="text-center">Message Allowed</th>
                            <th class="text-center">Price Detail</th>
                            <th class="text-center">Discount Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{packageDetails?.name}</td>
                            <td class="text-center">{packageDetails?.messagesAllowed}</td>
                            <td>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Monthly</th>
                                            <th class="text-center">Quaterly</th>
                                            <th class="text-center">Half Yearly</th>
                                            <th class="text-center">Yearly</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-right">{numberFormat(packageDetails?.price?.monthly)}</td>
                                            <td class="text-right">{numberFormat(packageDetails?.price?.quaterly)}</td>
                                            <td class="text-right">{numberFormat(packageDetails?.price?.halfyearly)}</td>
                                            <td class="text-right">{numberFormat(packageDetails?.price?.yearly)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Monthly</th>
                                            <th class="text-center">Quaterly</th>
                                            <th class="text-center">Half Yearly</th>
                                            <th class="text-center">Yearly</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-right">{numberFormat(packageDetails?.discount?.monthly)}</td>
                                            <td class="text-right">{numberFormat(packageDetails?.discount?.quaterly)}</td>
                                            <td class="text-right">{numberFormat(packageDetails?.discount?.halfyearly)}</td>
                                            <td class="text-right">{numberFormat(packageDetails?.discount?.yearly)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th colSpan={3}>Inrol Companies in this package</th>
                        </tr>
                        <tr>
                            <th class="text-center">S.No</th>
                            <th class="text-center">Company Name</th>
                            <th class="text-center">No of Instance Allowed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            companyDetails.map((value, key) => {
                                return (
                                    <tr key={key}>
                                        <td class="text-center">{key+1}</td>
                                        <td>{value.name}</td>
                                        <td class="text-center">{value.instanceAllowed}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default packageDetail