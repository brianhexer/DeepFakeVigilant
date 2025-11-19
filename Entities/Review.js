{
  "name": "Review",
  "type": "object",
  "properties": {
    "analysis_id": {
      "type": "string",
      "description": "ID of the analysis this review is for"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Star rating from 1 to 5"
    },
    "comment": {
      "type": "string",
      "description": "Optional comment from the user"
    },
    "accuracy_feedback": {
      "type": "string",
      "enum": [
        "very_accurate",
        "accurate",
        "somewhat_accurate",
        "inaccurate"
      ],
      "description": "User's feedback on accuracy"
    },
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Optional email for follow-up"
    }
  },
  "required": [
    "analysis_id",
    "rating"
  ],
  "rls": {
    "read": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        },
        {
          "user_condition": {
            "admin_level": "primary"
          }
        },
        {
          "user_condition": {
            "admin_level": "secondary"
          }
        }
      ]
    },
    "write": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    }
  }
}