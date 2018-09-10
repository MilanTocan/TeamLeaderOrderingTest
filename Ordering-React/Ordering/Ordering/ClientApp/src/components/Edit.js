import React, { Component } from "react";
import { Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import { CustomerList } from "./CustomerList";
import { OrderDetail } from "./OrderDetail";

export class Edit extends Component {

    constructor(props) {
        super(props);
        this.state = { orderData: null, customers: null, products: null, loading: true, unsavedChanges: false };

        this.fetchData = this.fetchData.bind(this);
        this.renderForm = this.renderForm.bind(this);

        this.handleCustomerChange = this.handleCustomerChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.getValidationState = this.getValidationState.bind(this);

        this.removeDetail = this.removeDetail.bind(this);
        this.addDetail = this.addDetail.bind(this);

        this.updateData = this.updateData.bind(this);

        this.fetchData();
    }

    // Fetch data
    fetchData() {
        const url = this.props.id === 0 ? "api/Order/New" : `api/Order/Edit/${this.props.id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    orderData: data.orderData,
                    customers: data.customers,
                    products: data.products,
                    loading: false
                });
            })
            .catch(e => console.error(e));
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.fetchData();
        }
    }

    // Event Handlers
    handleCustomerChange(event) {
        let orderData = this.state.orderData;
        orderData.customerId = event.target.value;

        this.setState({ orderData, unsavedChanges: true });
    }

    handleProductChange(event) {
        const orderDetailIndex = parseInt(event.target.getAttribute('data-index'), 10);
        let orderData = this.state.orderData;

        const product = this.state.products.filter(product => product.id === parseInt(event.target.value, 10))[0];

        orderData.orderDetails[orderDetailIndex].productId = parseInt(event.target.value, 10);
        orderData.orderDetails[orderDetailIndex].product = product;
        
        this.setState({ orderData });
        this.handlePriceChange();
    }

    handleQuantityChange(event) {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity > 0) {
            const orderDetailIndex = parseInt(event.target.getAttribute('data-index'), 10);

            let orderData = this.state.orderData;
            orderData.orderDetails[orderDetailIndex].quantity = newQuantity;

            this.setState({ orderData });
            this.handlePriceChange();
        }
    }

    handlePriceChange() {
        let orderData = this.state.orderData;
        const orderDetails = orderData.orderDetails;

        let total = 0;
        orderDetails.forEach((od) => {
            total += (od.product.price * od.quantity);
        });
        orderData.total = total;

        this.setState({ orderData, unsavedChanges: true });
    }

    // Add/Remove orderDetails
    removeDetail(event) {
        event.preventDefault();

        let orderData = this.state.orderData;
        const orderDetailIndex = parseInt(event.target.getAttribute('data-index'), 10);

        orderData.orderDetails.splice(orderDetailIndex, 1);

        this.setState({ orderData });
        this.handlePriceChange();
    }

    addDetail(event) {
        event.preventDefault();

        const newOrderDetail = {
            orderId: this.props.id,
            productId: this.state.products[0].id,
            quantity: 1,
            product: this.state.products[0]
        };
        const orderData = this.state.orderData;
        orderData.orderDetails.push(newOrderDetail);

        this.setState({ orderData });
        this.handlePriceChange();
    }

    // check form validation
    getValidationState(index) {
        return this.state.orderData.orderDetails[index].quantity >= 1 ? "success" : "error";
    }

    // Update data or create new
    updateData(event) {
        event.preventDefault();
        
        if (this.props.id !== 0) { // Edit existing order
            fetch(`api/Order/Edit/${this.props.id}`, {
                method: "PUT",
                body: JSON.stringify(this.state.orderData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                this.setState({ unsavedChanges: false });
                this.props.refreshParent();
                return response;
            }).catch(e => {
                console.error(e);
            });
        } else { // Add new Order
            fetch("api/Order/New", {
                method: "POST",
                body: JSON.stringify(this.state.orderData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ unsavedChanges: false });
                    this.props.refreshParent(response);
                    return response;
                }).catch(e => {
                    console.error(e);
                });
        }
    }

    renderForm() {
        return (
            <div>
                <Row>
                    {this.props.id > 0 &&
                        <h2>Edit Order</h2>
                    }
                    {this.props.id === 0 &&
                        <h2>Create Order</h2>
                    }
                    <hr />
                    <FormGroup controlId="customerId">
                        <Col componentClass={ControlLabel} smOffset={2} sm={1}>
                            Customer
                        </Col>
                        <Col sm={7}>
                            <CustomerList handler={this.handleCustomerChange} customers={this.state.customers} customerId={this.state.orderData.customerId} />
                        </Col>
                    </FormGroup>
                </Row>
                <Row>
                    {this.state.orderData.orderDetails.map((od, index) =>
                        <OrderDetail key={"orderDetail" + index}
                            index={index}
                            orderDetail={od}
                            products={this.state.products}
                            validateState={this.getValidationState}
                            handleProduct={this.handleProductChange}
                            handleQuantity={this.handleQuantityChange}
                            remove={this.removeDetail}
                        />
                    )}
                </Row>
                <Row>
                    <Col sm={1} smOffset={10}>
                        <button className="btn btn-success center-block" onClick={this.addDetail}>Add Product</button>
                    </Col>
                </Row>
                <hr />
                <h3><strong>Total: € {this.state.orderData.total.toFixed(2)}</strong></h3>
                <Row>
                    <Col sm={4} smOffset={4} className="small-padding-top">
                        <FormControl type="submit" className="btn btn-success" value="Save Changes" disabled={!this.state.unsavedChanges} />
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        const contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderForm();
        return (
            <Form horizontal className="small-padding" onSubmit={this.updateData}>
                {contents}
            </Form>
        );
    }
}