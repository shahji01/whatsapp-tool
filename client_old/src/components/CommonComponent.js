    import axios from 'axios';
    import {Link} from 'react-router-dom'
    import { NumericFormat } from 'react-number-format';
    import { 
      CButton,
     } from '@coreui/react'
    
    // export const baseUrl = 'http://142.93.166.222:9515/api';
    // export const baseUrlTwo = 'http://142.93.166.222:9515/';

    export const baseUrl = 'http://localhost:9515/api';
    export const baseUrlTwo = 'http://localhost:9515/';

    export const numberFormat = function (value){
      return <NumericFormat value={value} displayType={'text'} thousandSeparator={true} />
    }

    export const getSelectList = function () {
      const selectData = async () => {
        axios
        .get(''+baseUrl+'/packages')
        .then((response) => {
          const { data } = response.data;
          
          if(response.status === 200){
            return data;
          }
        })
        .catch((error) => console.log(error));
      };
      return selectData;
    }

    export const getListData = function (url){
      const response = axios.get(url);
      return response;
    }

    export const getVoucherData = function (url){
      const response = axios.get(url);
      return response;
    }

    export const inserData = function (url, data){
      
      const response = axios.post(url, data,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      return response;
    }

    export const displayButtonAddAndList = function (to,title,size,color){
      return <Link to={to}><CButton color={color} size={size}>{title}</CButton></Link>;
    }

    

