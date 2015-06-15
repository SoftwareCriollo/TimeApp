class Client
  include Mongoid::Document
  field :project_id, type: String
  field :name, type: String
  field :email, type: String
  field :git, type: String
  field :ssh, type: String
  field :send_mail, type: Boolean, default: true

  validates_presence_of :project_id, :name, :email
  validates :email, :presence => true, format: {with: /\b[A-Z0-9._%a-z\-]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,4}\z/}

  has_many :votes

end
