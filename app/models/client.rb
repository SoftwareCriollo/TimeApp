class Client
  include Mongoid::Document
  field :project_id, type: String
  field :name, type: String
  field :email, type: String
  field :git, type: String
  field :shh, type: String
  field :send_mail, type: Boolean, default: true

  validates_presence_of :project_id, :name, :email
  validates :email, :presence => true, format: {with: /A([^@\s]+)@((?:[-a-z0-9]+.)+[a-z]{2,})z/i}

end
