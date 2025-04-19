import streamlit as st
import pandas as pd
import requests
import time
import os

st.set_page_config(
    page_title="Reewild Jungle Health", page_icon="🌍", layout="wide")


hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            footer:before {
                content:'Built with 💚 in London 🇬🇧'; 
                visibility: visible;
                display: block;
                position: relative;
                
                top: 2px;
            }

            </style>
            """

st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Title and Description
st.title('DevOps Workshop - Distributed Systems 🚀')
st.write(
    '''
    Sample health check web app for verify distributed systems.
    '''
)

# Service URLs for health check
services = [
    {"name": "Express Mock API", "url": "http://p-express-mock-api/api/health", "type": "http_call"},
    {"name": "Weather API", "url": f'{os.getenv("services__apiservice__http__0")}/weatherforecast', "type": "http_call"},

]

# Function to check health status using HTTP request
def check_service_health(url):
    start_time = time.time()
    try:
        response = requests.get(url)
        response_time = time.time() - start_time
        if response.status_code == 200:
            return "Healthy", "🟢", response_time
        else:
            return f"Issue (Status {response.status_code})", "🟡", response_time
    except Exception as e:
        response_time = time.time() - start_time
        return f"Error: {str(e)}", "🔴", response_time

def check_secret_store():
    start_time = time.time()
    response_time = time.time() - start_time
    return "Healthy", "🟢", response_time
    
# Function to check the health of all services
def check_all_services():
    service_status = []
    total_response_time = 0
    for service in services:
        if service["type"] == "secrets":
            status, icon, response_time = check_secret_store()
        else: 
            status, icon, response_time = check_service_health(service["url"])
        service_status.append({
            "Service": service["name"],
            "Status": f"{icon} {status}",
            "Response Time (s)": round(response_time, 3)
        })
        total_response_time += response_time
    
    df_status = pd.DataFrame(service_status)
    return df_status, total_response_time

# Button to trigger health check
if st.button("Re-run 🏃‍♂️"):
    st.rerun()
else:
    # Initial service health check
    with st.spinner("Checking service health..."):
        df_status, total_response_time = check_all_services()

    # Displaying the initial service health status and metrics
    st.markdown("### Platform Metrics")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Healthy Services ✅", df_status[df_status["Status"].str.contains("Healthy")].shape[0])
        st.metric("Unavailable Services 🤒", len(services) - df_status[df_status["Status"].str.contains("Healthy")].shape[0])
    with col2:
        st.metric("Total Services", len(services))
        st.metric("Average Response Time (s)", round(total_response_time / len(services), 3))

    # DataFrame display for Service Status
    st.markdown("### Service Health Status")
    st.dataframe(df_status)

    # Additional Visualization
    st.subheader("Service Health Overview")
    healthy_services = df_status[df_status["Status"].str.contains("Healthy")].shape[0]
    total_services = len(services)
    missing_health = total_services - healthy_services

    # Bar chart visualization
    st.write("### Health Status Distribution")
    health_data = pd.DataFrame({
        "Status": ["🟢 Healthy", "🔴 Issues"],
        "Count": [healthy_services, missing_health]
    })
    st.bar_chart(health_data.set_index("Status"))
