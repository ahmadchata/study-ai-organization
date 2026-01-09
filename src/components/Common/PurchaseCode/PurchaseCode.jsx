import "./PurchaseCode.css";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SubscriptionAPI } from "../../../api/SubscriptionAPI";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "../../../Context/AuthContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const PurchaseCode = () => {
  const [selected, setSelected] = useState();
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const toggleCategory = (type) => {
    setSelected(type);
  };

  const setSubQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleQuantityBlur = () => {
    if (!quantity || Number(quantity) < 10) {
      setQuantity(10);
    }
  };

  const mutation = useMutation({
    mutationFn: (details) => {
      setLoading(true);
      const response = SubscriptionAPI.subscribe(details, true);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("Success", {
        autoHideDuration: 10000,
        style: {
          backgroundColor: "#0c7a50",
          color: "#f8ff06",
        },
      });
      navigate("/dashboard/subscriptions");
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

  const onSuccess = (reference) => {
    const data = {
      qty: quantity,
      subscription_type: subscriptions?.find((sub) => sub.price === selected)
        ?.type,
      payment_reference: reference.reference,
    };
    mutation.mutate(data);
  };

  const onClose = () => {
    console.log("closed");
  };

  //Paystack config
  const config = {
    reference: new Date().getTime().toString(),
    email: user?.user?.email,
    // email: "ahmadchata@gmail.com",
    amount: parseInt((selected * quantity).toFixed(2)) * 100,
    publicKey: "pk_live_0e5f69ef74c0a55f7304208081f264ab6b2052ed",
    // publicKey: "pk_test_01eeb95bc21f2f8f531ddaed08da9f5a0c1114c1",
  };

  const initializePayment = usePaystackPayment(config);

  const subscribe = () => {
    initializePayment({ onSuccess, onClose });
  };

  const { isFetching, data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => SubscriptionAPI.getSubscriptionTypes(true),
    select: (data) =>
      data?.filter(
        (subscription) => subscription?.type?.toLowerCase() !== "trial"
      ),
  });

  if (isFetching) return <p className="m-0">Loading...</p>;

  return (
    <div className="container px-3 py-3 py-lg-4">
      <div className="row mx-0">
        <div className="col-12 col-lg-5 row mx-0 sub-holder overflow-auto p-3">
          <span
            onClick={() => navigate(-1)}
            className="p-0 d-flex align-items-center pointer mb-4"
          >
            <KeyboardArrowLeft /> Go back
          </span>
          <div className={`col-12 p-0`}>
            <div className={``}>
              <h5 className="m-0 p-0 price-desc">Quantity</h5>
              <div className="w-100 mt-3">
                <input
                  type="number"
                  value={quantity}
                  onChange={setSubQuantity}
                  onBlur={handleQuantityBlur}
                  className="me-4 w-100 py-2 px-3 qty-input"
                />
              </div>
            </div>
          </div>
          <p className="mt-2 extra-small">Minimum quantity is 10</p>
          {subscriptions?.map((subscription) => (
            <div key={subscription?.type} className={`col-12 p-0 mt-4 pointer`}>
              <div
                className={`p-3 d-flex align-items-center selection-card align-items-center ${
                  selected === subscription?.price ? "selectedSub" : ""
                }`}
                onClick={() => toggleCategory(subscription?.price)}
              >
                <div>
                  <input
                    type="radio"
                    className="me-4"
                    checked={selected === subscription?.price}
                    readOnly
                  />
                </div>
                <div>
                  <h5 className="m-0 p-0 price-desc">
                    {subscription?.name}{" "}
                    <span className="ms-1 small">
                      ({subscription?.duration})
                    </span>
                  </h5>
                  <p className="m-0 mt-2 p-0 price">
                    ₦ {subscription?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="order-summary mt-4 p-3">
            <h5 className="summary-header">Order Summary</h5>
            {selected ? (
              <>
                <div className="d-flex justify-content-between mt-3">
                  <p className="grey m-0 p-0">Quantity</p>
                  <p className="m-0 p-0">{quantity}</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <p className="grey m-0 p-0">Amount</p>
                  <p className="m-0 p-0">
                    ₦{" "}
                    {
                      subscriptions?.find((sub) => sub.price === selected)
                        ?.description
                    }
                  </p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <p className="grey m-0 p-0">VAT (7.5%)</p>
                  <p className="m-0 p-0">
                    ₦{" "}
                    {Math.round(
                      (7.5 / 100) *
                        subscriptions?.find((sub) => sub.price === selected)
                          ?.description
                    )}
                  </p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <p className="grey m-0 p-0">Duration</p>
                  <p className="m-0 p-0">
                    {
                      subscriptions?.find((sub) => sub.price === selected)
                        ?.duration
                    }
                  </p>
                </div>
                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                  <p className="m-0 p-0">Total</p>
                  <p className="m-0 p-0 green-text fs-5">
                    ₦ {(selected * quantity).toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <p>Please select a subscription plan</p>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-7 px-2 px-lg-5 mt-5 mt-lg-0">
          <h6>Contact information</h6>
          <p className="grey-bg px-3 py-2 grey border mt-3 mb-4">
            <span className="me-5">Email</span>
            {user?.user?.email}
          </p>
          <h6>Payment method</h6>
          <div className={`mt-3 col-12 p-0 pointer`}>
            <div
              className={`p-3 d-flex align-items-center selection-card align-items-center`}
            >
              <div>
                <input type="radio" className="me-4" checked readOnly />
              </div>
              <div className="d-flex justify-content-between w-100">
                <h5 className="m-0 p-0 price-desc">Paystack</h5>
                <img
                  src="/assets/paystack.png"
                  width={146}
                  height={23}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
          <div className={`mt-3 col-12 p-0 pointer`}>
            <div
              className={`p-3 d-flex align-items-center selection-card align-items-center`}
            >
              <div>
                <input type="radio" className="me-4" disabled />
              </div>
              <div className="d-flex justify-content-between w-100">
                <h5 className="m-0 p-0 price-desc">Flutterwave</h5>
                <img
                  className="img-fluid"
                  src="/assets/fwave.png"
                  width={200}
                  height={23}
                />
              </div>
            </div>
          </div>
          {selected && (
            <button
              disabled={loading}
              onClick={subscribe}
              className="py-2 mt-3 btn default-btn w-100"
            >
              {loading ? "Loading..." : "Subscribe"}
            </button>
          )}
          <p className="text-center mt-2 extra-small">
            By subscribing, you authorize Study AI to charge you according to
            the terms
          </p>
        </div>
      </div>
    </div>
  );
};
export default PurchaseCode;
