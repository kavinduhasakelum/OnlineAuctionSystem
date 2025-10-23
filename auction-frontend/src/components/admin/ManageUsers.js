import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Modal,
  Alert,
  Spinner,
  Pagination,
} from "react-bootstrap";
import api from "../../api/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [forceDelete, setForceDelete] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page: currentPage,
        limit: 10,
      };
      
      if (roleFilter) params.role = roleFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/AdminApi/users", { params });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(`/AdminApi/users/${userId}`);
      setUserDetails(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user details");
    }
  };

  const handleRoleChange = async () => {
    if (!newRole) {
      setError("Please select a role");
      return;
    }

    try {
      setError("");
      const response = await api.put(`/AdminApi/users/${selectedUser.id}/role`, {
        role: newRole,
      });
      setSuccess(response.data.message);
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async () => {
    try {
      setError("");
      const response = await api.delete(`/AdminApi/users/${selectedUser.id}`, {
        data: {
          reason: deleteReason || "Administrative action",
          forceDelete: forceDelete,
        },
      });
      setSuccess(response.data.message);
      setShowDeleteModal(false);
      setDeleteReason("");
      setForceDelete(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      if (err.response?.data?.activeAuctions) {
        setError(
          `User has ${err.response.data.activeAuctions} active auctions. Check "Force Delete" to proceed anyway.`
        );
      }
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Admin":
        return "danger";
      case "Seller":
        return "primary";
      case "Buyer":
        return "success";
      default:
        return "secondary";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Manage Users</h2>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Role</Form.Label>
                <Form.Select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form onSubmit={handleSearch}>
                <Form.Group>
                  <Form.Label>Search Users</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="primary">Search</Button>
                    {searchTerm && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <div className="mt-2 text-muted">
            Total Users: {totalCount}
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <>
          <Card>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => fetchUserDetails(user.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => openRoleModal(user)}
                          >
                            Change Role
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openDeleteModal(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Role Change Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                <strong>User:</strong> {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              </p>
              <p>
                <strong>Current Role:</strong>{" "}
                <Badge bg={getRoleBadgeVariant(selectedUser.role)}>
                  {selectedUser.role}
                </Badge>
              </p>
              <Form.Group>
                <Form.Label>New Role</Form.Label>
                <Form.Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRoleChange}>
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <Alert variant="danger">
                <strong>Warning:</strong> This action cannot be undone. All user data will be permanently deleted.
              </Alert>
              <p>
                <strong>User:</strong> {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Reason for Deletion (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Enter reason for deletion..."
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Force delete (delete even if user has active auctions)"
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userDetails && (
            <>
              <h5>User Information</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>ID:</strong> {userDetails.user.id}</p>
                  <p><strong>Name:</strong> {userDetails.user.firstName} {userDetails.user.lastName}</p>
                  <p><strong>Email:</strong> {userDetails.user.email}</p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Role:</strong>{" "}
                    <Badge bg={getRoleBadgeVariant(userDetails.user.role)}>
                      {userDetails.user.role}
                    </Badge>
                  </p>
                  <p><strong>Created:</strong> {new Date(userDetails.user.createdAt).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(userDetails.user.updatedAt).toLocaleString()}</p>
                </Col>
              </Row>

              <hr />

              <h5>Statistics</h5>
              <Row>
                <Col md={4}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h3>{userDetails.stats.productsListed}</h3>
                      <p className="mb-0 text-muted">Products Listed</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h3>{userDetails.stats.bidsPlaced}</h3>
                      <p className="mb-0 text-muted">Bids Placed</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h3>{userDetails.stats.auctionsWon}</h3>
                      <p className="mb-0 text-muted">Auctions Won</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
