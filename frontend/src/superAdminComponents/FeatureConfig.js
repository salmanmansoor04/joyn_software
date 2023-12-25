import { useState, useEffect } from "react";
import Axios from 'axios';

import '../styles/FeatureConfig.css'

import Spinner from '../components/Spinner'

function FeatureConfig(props) {

    const [customers, setCustomers] = useState([])

    const [features, setFeatures] = useState([])

    const [featureSmallWindowOpen, setFeatureSmallWindowOpen] = useState(0)

    const [selectedFeatures, setSelectedFeatures] = useState([])

    const [customerId, setCustomerId] = useState('');

    const [isLoading, setIsLoading] = useState(true)

    const [isLoading2, setIsLoading2] = useState(false)

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAFeatureConfigInit', {})
            .then(res => {
                console.log(res.data)
                setCustomers(res.data.customers)
                setFeatures(res.data.features)
                setFeatureSmallWindowOpen(0)
                setIsLoading(false)
                setIsLoading2(false)
            }).catch(err => { console.log(err) })
    }

    const deleteFeatureForCustomer = (feature_id, customer_id) => {
        setIsLoading2(true)
        console.log('feature', feature_id)
        console.log('customer', customer_id)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAFeatureConfigDelete', {feature_id: feature_id, cust_id: customer_id})
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { console.log(err) })
    }

    const assignButtonClicked = (item) => {
        let tempSelectedFeatures = item.features
        setFeatureSmallWindowOpen(item.id)
        setCustomerId(item.id)
        setSelectedFeatures([...tempSelectedFeatures])
    }

    const featureClicked = (item) => {
        let temp = selectedFeatures;
        if(temp.some((val) => {return val.id === item.id})){
            temp = temp.filter((value) => {
                return value.id !== item.id
            })
        }else{
            temp.push(item)
        }

        setSelectedFeatures([...temp])

    }

    const assignFeatures = () => {
        setIsLoading2(true)
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAFeatureConfigAssign', {cust_id: customerId, features: selectedFeatures})
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { console.log(err) })

    }

    return (
        <div className="FeatureConfig_wrapper">
            {isLoading &&
                <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                    <Spinner />
                </div>
            }
            {isLoading2 &&
                <div style={{ height: '100%', width: '100%', background: 'transparent', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                    <Spinner />
                </div>
            }
            <div className="FeatureConfig_Customers_Flex">
                {customers.map((item, index) => {
                    return (
                        <div className="FeatureConfig_Customers_Flex_Item">
                            <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>{item.name}</div>
                            <div style={{ position: 'relative', fontWeight: 'bold', marginTop: '20px', marginLeft: '10px', textAlign: 'left', fontSize: '13px' }}>
                                Features
                                {featureSmallWindowOpen !== item.id &&
                                    <i onClick={() => assignButtonClicked(item)} title='Assign Features' style={{ cursor: 'pointer', marginLeft: '10px' }} className="fa fa-plus" aria-hidden="true">
                                    </i>
                                }
                                {featureSmallWindowOpen === item.id &&
                                    <i onClick={() => setFeatureSmallWindowOpen(0)} title='Assign Features' style={{ cursor: 'pointer', marginLeft: '10px' }} className="fa fa-minus" aria-hidden="true">
                                    </i>
                                }

                                {featureSmallWindowOpen === item.id &&
                                    <div className="FeatureConfig_featureSmallWindow">
                                        {features.map((item, index) => {
                                            return(
                                                <div>
                                                    <input onChange={() => featureClicked(item)} checked={selectedFeatures.some((val) => {return val.id === item.id})} type='checkbox'  /> {item.name}
                                                </div>
                                            )
                                        })}
                                        <div style={{textAlign:'center', marginTop: '10px'}}>
                                            <button onClick={() => assignFeatures()} style={{backgroundColor: '#4162A6' ,color:  'white', cursor: 'pointer', border: 'none'}}>Assign</button>
                                        </div>
                                    </div>
                                }
                            </div>
                            <ul className="FeatureConfig_list">
                                {item.features.map((item1, index1) => {
                                    return (
                                        <li>
                                            {item1.name}
                                            <i onClick={() => deleteFeatureForCustomer(item1.id, item.id)} title='Assign Features' style={{ cursor: 'pointer', marginLeft: '10px' }} className="fa fa-trash" aria-hidden="true">
                                            </i>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FeatureConfig