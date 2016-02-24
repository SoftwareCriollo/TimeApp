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
  field :active,             type: Boolean, default: true
  field :token_authentication, type: String
  field :factor_time, type: Float, default: 1

  scope :active_users, ->{ where(active: true).all }
  
  before_save do
    change_token
    self
  end
  
  #def self.serialize_from_session(key, salt)
  #  record = to_adapter.get(key[0].as_json["$oid"])
  #  record if record && record.authenticatable_salt == salt
  #end

  def name
    email
  end

  def self.find_by_access_token(token)
    where(token_authentication: token).first
  end
  
  def disable
    self.active = false
    self.save
  end  

  def time_for_user(time)
    factor_time * time
  end  
  
  def update_password(params)
    update(params)
    change_token
    self.save
  end
  private

  def change_token
    if sign_in_count_changed?
      begin
        self.token_authentication = generate_token
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