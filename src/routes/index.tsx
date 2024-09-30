import { Route, Routes, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import ProtectedRoute from "./ProtectedRoute"
import Dashboard from "@/pages/dashboard/Dashboard"
import SubmitInnovation from "@/pages/submit-innovation/submit-innovation"
import Home from "@/pages/home"
import ManagementInnovation from "@/pages/management-innovation/management-innovation"
import DataManagementUser from "@/pages/management/user/data-user"
import DataManagementBatch from "@/pages/management/batch/data-batch"
import AddDataManagementUser from "@/pages/management/user/add-data-user"
import EditDataManagementUser from "@/pages/management/user/edit-data-user"
import AddDataManagementBatch from "@/pages/management/batch/add-data-batch"
import DataManagementJuri from "@/pages/management/juri/data-juri"
import AddDataManagementJuri from "@/pages/management/juri/add-data-juri"


const AppRouter = () => {
    const location = useLocation()

    // let isLoggedIn = localStorage.getItem("user-auth") !== null
    // let isFirstLogin = localStorage.getItem("user-status-password")

    return (
        <AnimatePresence mode="wait">
            <Routes
                key={location.pathname}
                location={location}
            >

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/submit-innovation"
                        element={<SubmitInnovation />}
                    />

                    <Route
                        path="/management-innovation"
                        element={<ManagementInnovation />}
                    />


                    {/* Management */}
                    <Route
                        path="/management/user"
                        element={<DataManagementUser />}
                    />

                    <Route
                        path="/management/user/add"
                        element={<AddDataManagementUser />}
                    />

                    <Route
                        path="/management/user/:id/edit"
                        element={<EditDataManagementUser />}
                    />

                    <Route
                        path="/management/juri"
                        element={<DataManagementJuri />}
                    />

                    <Route
                        path="/management/juri/add"
                        element={<AddDataManagementJuri />}
                    />

                    <Route
                        path="/management/batch"
                        element={<DataManagementBatch />}
                    />

                    <Route
                        path="/management/batch/add"
                        element={<AddDataManagementBatch />}
                    />
                </Route>


            </Routes>
        </AnimatePresence>
    )
}

export default AppRouter
