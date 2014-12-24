require "rails_helper"

RSpec.describe User, :type => :model do
  describe "#callbacks" do
    describe "sign_in_count" do
      describe "changed" do
        let!(:user){ create(:user)} #created after mocking
        before do
          expect_any_instance_of(User).to receive(:generate_token)
          user.sign_in_count = 2
        end
        it { user.save }
      end
      describe "not changed" do
        let!(:user){ create(:user) }
        before do
          expect_any_instance_of(User).to_not receive(:generate_token)
        end
        it { user.save }
      end
    end
  end
end