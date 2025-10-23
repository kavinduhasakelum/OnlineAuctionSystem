# Admin Dashboard - Quick Start Guide

## 🚀 Quick Start

### 1. Access Admin Panel
- Login with admin credentials
- You'll be redirected to the Admin Home page
- See overview statistics and quick actions

### 2. Main Features

#### 📊 Admin Home (`/admin/home`)
**What you'll see:**
- Real-time statistics cards (Users, Active Auctions, Pending Products, Total Bids)
- Warning alerts for pending product approvals
- 3 main action cards:
  - 👥 Manage Users
  - 🏷️ Manage Auctions (with pending badge)
  - 📊 System Dashboard
- Recent Users list (last 3)
- Recent Products list (last 3)

**Quick Actions:**
- Click "Go to Users" → User management
- Click "Manage Auctions" → Product approval
- Click "View Dashboard" → Full statistics

---

#### 👥 Manage Users (`/admin/users`)

**Top Section - Filters:**
```
[Filter by Role: ▼ All Roles]  [Search: _______________ ] [Search] [Clear]
Total Users: 25
```

**Table Columns:**
- ID | Name | Email | Role | Created At | Actions

**Actions per User:**
- [View] - See detailed stats (Products Listed, Bids Placed, Auctions Won)
- [Change Role] - Update role (Admin/Seller/Buyer)
- [Delete] - Remove user account

**Features:**
- Search by name or email
- Filter by role (Admin, Seller, Buyer)
- Pagination at bottom
- Role badges with colors (Admin=red, Seller=blue, Buyer=green)

**User Details Modal:**
```
User Information:
- ID: 123
- Name: John Doe
- Email: john@example.com
- Role: Seller
- Created: 2024-01-15
- Updated: 2024-10-20

Statistics:
[5]              [12]             [3]
Products Listed  Bids Placed      Auctions Won
```

**Change Role Modal:**
```
User: John Doe (john@example.com)
Current Role: [Seller]
New Role: [▼ Select Role]
        - Admin
        - Seller
        - Buyer
[Cancel] [Update Role]
```

**Delete User Modal:**
```
⚠️ Warning: This action cannot be undone.
User: John Doe (john@example.com)
Reason: [________________________]
☐ Force delete (even with active auctions)
[Cancel] [Delete User]
```

---

#### 🏷️ Manage Auctions (`/admin/auctions`)

**Tabs:**
```
[Pending Approval] [Approved] [Active] [Sold] [Expired] [All Products]
```

**Table Columns:**
- ID | Product Name | Seller | Starting Price | Current Bid | Status | Approved | End Date | Actions

**Actions per Product:**
- For Pending: [Approve] [Reject]
- For All: [Delete]

**Status Badges:**
- Active (green)
- Pending (yellow)
- Sold (blue)
- Expired (gray)

**Approved Indicators:**
- ✓ Approved (green badge)
- ✗ Not Approved (red badge)

**Approve Modal:**
```
✓ This product will be approved and made available for bidding.

Product: Vintage Camera
Seller: Jane Smith
Starting Price: $50.00
End Date: 2024-10-25 18:00

[Cancel] [Approve Product]
```

**Reject Modal:**
```
⚠️ Warning: Product will be permanently deleted and seller notified.

Product: Vintage Camera
Seller: Jane Smith
Reason for Rejection: *
[_________________________________]
(Will be sent to the seller)

[Cancel] [Reject Product]
```

**Delete Modal:**
```
⚠️ Warning: This action cannot be undone.
⚠️ Note: This product has active bids. All bidders will be notified.

Product: Vintage Camera
Seller: Jane Smith
Status: [Active]
Current Bid: $75.00
Reason: [________________________]

[Cancel] [Delete Product]
```

---

#### 📊 System Dashboard (`/admin/dashboard`)

**Overview Cards (Row 1):**
```
[25]          [150]           [8]              [42]           [256]
Total Users   Total Products  Pending Products Active Auctions Total Bids
```

**Analytics Tables (Row 2):**

**Users by Role:**
```
┌─────────────────────┐
│ Users by Role       │
├─────────┬───────────┤
│ Role    │ Count     │
├─────────┼───────────┤
│ [Admin] │ 2         │
│ [Seller]│ 12        │
│ [Buyer] │ 11        │
└─────────┴───────────┘
```

**Products by Status:**
```
┌─────────────────────┐
│ Products by Status  │
├─────────┬───────────┤
│ Status  │ Count     │
├─────────┼───────────┤
│ [Active]│ 42        │
│[Pending]│ 8         │
│ [Sold]  │ 85        │
│[Expired]│ 15        │
└─────────┴───────────┘
```

**Recent Users Table:**
```
Name            Email               Role      Joined
John Doe        john@example.com    [Seller]  Oct 20
Jane Smith      jane@example.com    [Buyer]   Oct 19
...
                        [View All Users →]
```

**Recent Products Table:**
```
Product         Seller          Status      Created
Vintage Camera  Jane Smith      [Active]    Oct 20
Old Books       John Doe        [Pending]   Oct 19
...
                        [View All Products →]
```

**Alert (if pending):**
```
⚠️ Action Required: You have 8 product(s) pending approval. [Review Now]
```

---

## 🎨 Color Coding

### Role Badges
- 🔴 **Admin** - Red (danger)
- 🔵 **Seller** - Blue (primary)
- 🟢 **Buyer** - Green (success)

### Status Badges
- 🟢 **Active** - Green (success)
- 🟡 **Pending** - Yellow (warning)
- 🔵 **Sold** - Blue (info)
- ⚫ **Expired** - Gray (secondary)

### Approval Indicators
- ✓ **Approved** - Green badge
- ✗ **Not Approved** - Red badge

---

## 📱 Responsive Design

All components are fully responsive:
- **Desktop:** Full table view with all columns
- **Tablet:** Stacked action buttons, responsive tables
- **Mobile:** Card-based layouts, bottom sheet modals

---

## ⚡ Real-time Features

- **Automatic Refresh:** Data updates after every action
- **Live Counts:** Statistics update immediately
- **Alert Notifications:** Instant feedback for pending approvals
- **Success Messages:** Green alerts for successful operations
- **Error Messages:** Red alerts for failed operations

---

## 🔒 Security Features

1. **Protected Routes:** Only admins can access
2. **Confirmation Dialogs:** All destructive actions require confirmation
3. **Self-Protection:** Cannot modify own account
4. **Audit Trail:** All actions logged on backend
5. **JWT Required:** All API calls authenticated

---

## 💡 Tips

1. **Use Search:** Quickly find users by name or email
2. **Filter by Status:** Focus on specific product states
3. **Check Dashboard First:** See if there are pending approvals
4. **Read Reasons:** Check rejection reasons before taking action
5. **Force Delete Carefully:** Use only when necessary
6. **Monitor Recent Activity:** Keep track of new users and products

---

## 🚨 Common Workflows

### Approve New Products
1. Go to Admin Home
2. Click "Review Now" on warning alert OR
3. Navigate to Manage Auctions → Pending Approval tab
4. Review product details
5. Click [Approve] to publish OR [Reject] to remove

### Change User Role
1. Navigate to Manage Users
2. Find user (search/filter)
3. Click [Change Role]
4. Select new role
5. Click [Update Role]
6. User receives notification

### Monitor System Health
1. Navigate to System Dashboard
2. Check overview statistics
3. Review user/product distribution
4. Monitor recent activity
5. Take action if needed

### Delete Problematic Content
1. Navigate to Manage Auctions
2. Find product
3. Click [Delete]
4. Enter reason (optional)
5. Confirm deletion
6. All bidders notified automatically

---

## 📞 Need Help?

- **No data showing?** Check if API is running
- **401 Error?** Verify you're logged in as Admin
- **Can't delete user?** Check if they have active auctions (use Force Delete)
- **Pagination not working?** Refresh the page

---

## ✨ What's Implemented

✅ User Management (View, Search, Filter, Role Change, Delete)
✅ Product Approval (Approve, Reject with Reason)
✅ Product Management (View, Filter by Status, Delete)
✅ Dashboard Statistics (Overview, Breakdowns, Recent Activity)
✅ Notifications (Email notifications to affected users)
✅ Pagination (Handle large datasets)
✅ Search & Filter (Quick data discovery)
✅ Responsive Design (Works on all devices)
✅ Error Handling (User-friendly messages)
✅ Confirmation Dialogs (Prevent accidental actions)

---

**Happy Administrating! 🎉**
