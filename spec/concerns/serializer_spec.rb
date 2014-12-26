require "rails_helper"

RSpec.describe "Serializer", :type => :concern do
  include Serializer

  describe "#arrays_object" do
    let(:options) { 
      [ User.new(email: "test@email.co",sign_in_count: 2),
        User.new(email: "test2@email.co",sign_in_count: 2)
      ] }
    let(:serialized){ arrays_object(options, [:email] ) }

    it{ expect(serialized.length).to eql(2) }

    describe ".keys" do
      subject{serialized.first}
    
      it{ is_expected.to have_key(:email)}
      it{ is_expected.to_not have_key(:sign_in_count)}

    end

  end 
end
