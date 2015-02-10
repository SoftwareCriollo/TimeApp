class Client
  include Mongoid::Document
  field :project_id, type: String
  field :name, type: String
  field :email, type: String
  field :git, type: String
  field :ssh, type: String
  field :send_mail, type: Boolean, default: true

  validates_presence_of :project_id, :name, :email

end
