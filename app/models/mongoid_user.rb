class MongoidUser
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  ## Database authenticatable
  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  ## Recoverable
  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  field :remember_created_at, type: Time

  ## Trackable
  field :sign_in_count,      type: Integer, default: 0
  field :current_sign_in_at, type: Time
  field :last_sign_in_at,    type: Time
  field :current_sign_in_ip, type: String
  field :last_sign_in_ip,    type: String

  field :token_authentication, type: String

  before_save do
    change_token
    self
  end

  def self.find_by_access_token(token)
    where(token_authentication: token).first
  end

  private

  def change_token
    if sign_in_count_changed?
      begin
        self.token_authentication = generate_token
        puts " ----> #{self.class.where(token_authentication: token_authentication).count > 0}"
      end while self.class.where(token_authentication: token_authentication).count > 0     
    else
      false
    end
  end

  def generate_token
    Devise.friendly_token << SecureRandom.hex
  end
end
User = MongoidUser