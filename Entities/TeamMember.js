{
  "name": "TeamMember",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the team member"
    },
    "role": {
      "type": "string",
      "description": "Job title/role of the team member"
    },
    "description": {
      "type": "string",
      "description": "Brief description about the team member"
    },
    "profile_image": {
      "type": "string",
      "description": "URL of the profile image"
    },
    "display_order": {
      "type": "number",
      "description": "Order for displaying team members"
    }
  },
  "required": [
    "name",
    "role"
  ],
  "rls": {
    "read": {},
    "write": {
      "$or": [
        {
          "user_condition": {
            "role": "admin"
          }
        },
        {
          "user_condition": {
            "admin_level": "primary"
          }
        }
      ]
    }
  }
}