
class RegistrationsController < Pyr::Base::RegistrationsController
  before_action :show_me_the_money

  private

  def show_me_the_money
    puts "*****"* 80
    puts "HELLO"
  end
end
